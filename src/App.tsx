import './App.css'
import { useState, useEffect } from 'react';
import { getDefensiveScores, getPlayers, getPlayerScores, getTeams } from './utils/scores';
import { populateFantasyPlayerScores } from './utils/input';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ClientSideRowModelModule, ModuleRegistry, type ColDef, type ColGroupDef } from 'ag-grid-community';
import type FantasyPlayer from './interfaces/FantasyPlayer';
import { Position, Round } from './interfaces/FantasyPlayer';
import { themeQuartz } from 'ag-grid-community';
import ScoringRules from './ScoringRules';
import { ROUND_TO_EVENTS, roundToPicks } from './utils/constants';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// const GET_EVENTS_API = "https://site.web.api.espn.com/apis/personalized/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn";

const leftAlign = {
  'text-align': 'left',
};


function App() {
  // const [events, setEvents] = useState([] as string[]);
  // const [gameData, setGameData] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [columnDefs, setColumnDefs] = useState([] as (ColDef | ColGroupDef)[]);
  const [rowDefs, setRowDefs] = useState([] as any[]);
  const [totalRowDefs, setTotalRowDefs] = useState([] as any[]);
  const [selectedRound, setSelectedRound] = useState<Round>(Round.WILDCARD);
  const [roundToScores, setRoundToScores] = useState<{ [key: string]: FantasyPlayer[] }>({});

  const getRowClass = (params: any) => {
    if (params.data?.position === 'Total') {
      return 'total-row';
    }
    return '';
  };

  const getColumnDefs = (players: FantasyPlayer[]): (ColDef | ColGroupDef)[] => {

    const columns: (ColDef | ColGroupDef)[] = [];
    columns.push({
      headerName: "Position",
      field: 'position',
      pinned: 'left'
    });

    players.forEach(player => {
      const playerName = player.fantasyPlayerName.split(' ')[0];
      columns.push({
        headerName: player.fantasyPlayerName,
        children: [{ field: `${playerName}-name`, headerName: '', cellStyle: leftAlign, }, { field: `${playerName}-score`, headerName: '', cellStyle: leftAlign, maxWidth: 70 }],
      })
    });

    return columns;
  };

  const getTotalRowDefs = (totalScores: { [key: string]: number }): any[] => {
    const rows: any[] = [];
    Object.keys(totalScores).forEach(player => {
      rows.push({ name: player, score: totalScores[player] })
    });
    rows.sort((a, b) => b.score - a.score);
    return rows;
  }

  const getRowData = (players: FantasyPlayer[]): any[] => {
    const rows: any[] = [];
    let i = 0;
    [...Object.values(Position), 'Total'].forEach(position => {
      const row: { [x: string]: string | number; } = {};
      row['position'] = position;
      players.forEach(player => {
        const playerName = player.fantasyPlayerName.split(' ')[0];
        if (Position.DEF == position) {
          row[`${playerName}-name`] = player.defensiveSelection.name;
          row[`${playerName}-score`] = player.defensiveSelection.score;
        } else if (position == 'Total') {
          row[`${playerName}-score`] = player.totalScore;
        } else {
          row[`${playerName}-name`] = player.playerSelections[i].name;
          row[`${playerName}-score`] = player.playerSelections[i].score;
        }
      });
      rows.push(row);
      i += 1
    });
    return rows;
  }

  useEffect(() => {
    const fetchData = async () => {
      // const eventsResult = await fetch(GET_EVENTS_API);
      // const eventsUnpacked = await eventsResult.json();

      // const eventIds = parseEventsData(eventsUnpacked);

      const roundsToGames: { [x: string]: any[]; } = {};
      const rToScores: { [x: string]: FantasyPlayer[]; } = {};
      const rounds = Object.values(Round);
      for (let i = 0; i < rounds.length; i++) {
        let games = await getGames(ROUND_TO_EVENTS[rounds[i]]);
        // filter out any games which haven't started, those players will get 0 points
        // games = games.filter((game) => hasGameStarted(game['header']));
        roundsToGames[rounds[i]] = games;
        let allTeamData = {};
        let allPlayerData = {};
        games.forEach(game => {
          allTeamData = {
            ...allTeamData,
            ...getTeams(game)
          }

          allPlayerData = {
            ...allPlayerData,
            ...getPlayers(game)
          }
        });
        const playerIdToNamesPromise = await getAllPlayerIdsToNames(Object.keys(allTeamData));

        rToScores[rounds[i]] = populateFantasyPlayerScores(roundToPicks[rounds[i] as Round], getPlayerScores(allPlayerData, playerIdToNamesPromise), getDefensiveScores(allTeamData));
      }

      const totalScores: { [x: string]: number; } = {};
      rToScores[Round.WILDCARD].forEach((player) => {
        totalScores[player.fantasyPlayerName] = 0;
      });

      rounds.forEach(round => {
        rToScores[round].forEach(rpl => {
          totalScores[rpl.fantasyPlayerName] += rpl.totalScore;
        });
      });


      setRoundToScores(rToScores);
      setSelectedRound(Round.CONFERENCE);
      setTotalRowDefs(getTotalRowDefs(totalScores));
      setLoading(false);
    }

    fetchData().catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (!roundToScores[selectedRound]) {
      console.log('undefined!!')
      return;
    }
    setColumnDefs([]);
    setRowDefs([]);

    console.log('changing grid defs!!', selectedRound, roundToScores[selectedRound]);
    setColumnDefs(getColumnDefs(roundToScores[selectedRound]));
    setRowDefs(getRowData(roundToScores[selectedRound]));
  }, [selectedRound]);

  // const parseEventsData = (json: any): string[] => {
  //   const gameIds: string[] = [];
  //   json['sports'][0]['leagues'][0]['events'].forEach((ev: { [x: string]: any; }) => {
  //     gameIds.push(ev['id']);
  //   });
  //   return gameIds;
  // };

  // const getEventIdsFromRounds = (rounds: { [x: string]: string[]; }): string[] => {
  //   let events: string[] = [];
  //   Object.values(rounds).forEach((ids) => {
  //     events = [...events, ...ids];
  //   });

  //   return events;
  // };

  const getGameSummaryUrl = (eventId: string): string => {
    return `https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/summary?region=us&lang=en&contentorigin=espn&event=${eventId}&features=ng`;

  };

  const getRosterUrl = (teamId: string): string => {
    return `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/roster`;

  };

  const getAllPlayerIdsToNames = async (teamIds: string[]): Promise<{ [x: string]: string; }> => {
    const allPlayers: { [x: string]: string; } = {};
    // const danielPlayers: { [x: string]: string; }[] = [];
    const promises: any[] = [];
    teamIds.forEach(teamId => promises.push(fetch(getRosterUrl(teamId), { cache: 'force-cache' })));
    const results = await Promise.all(promises);
    const unpacked = [];
    for (let index = 0; index < results.length; index++) {
      const data = await results[index].json();
      unpacked.push(data);
    }

    unpacked.forEach((roster) => {
      // const teamName = roster['team']['name'];
      roster['athletes'].forEach((athlete: { [x: string]: any; }) => {
        athlete['items'].forEach((person: { [x: string]: any; }) => {
          allPlayers[person['id']] = person['displayName'];
          // danielPlayers.push({
          //   'Name': person['displayName'],
          //   'Position': person['position']['displayName'],
          //   'Team': teamName
          // });
        });
      });
    });
    // console.log('daniel: ', danielPlayers);
    return allPlayers;
  }

  const getGames = async (eventIds: string[]): Promise<any[]> => {
    const promises: any[] = []
    eventIds.forEach(eventId => promises.push(fetch(getGameSummaryUrl(eventId))));
    const results = await Promise.all(promises);
    const unpackedResults = await unpackGameData(results);
    return unpackedResults;
  }

  const unpackGameData = async (gameData: any[]): Promise<any[]> => {
    const unpacked = [];
    for (let index = 0; index < gameData.length; index++) {
      const data = await gameData[index].json();
      unpacked.push(data);
    }

    return unpacked;
  }

  return (
    <div>
      <div className="picks-button">
        <a
          href="https://forms.gle/4TCy3MP664AnfAGL9"
          target="_blank"
          rel="noopener noreferrer"
          className="header-button"
        >
          Choose your picks here!
        </a></div>
      <header className="page-header">
        <h1>🏈 Playoff Fantasy Football 2026 🏈</h1>

        <label className='round-label'>
          <b>Round:&nbsp;&nbsp;</b>
          <span className="dropdown-pill">
            <select
              className="round-dropdown"
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value as Round)}
            >
              {Object.values(Round).map((round) => (
                <option key={round} value={round}>
                  {round}
                </option>
              ))}
            </select>
          </span>
        </label>
      </header>
      {(loading || (roundToScores[selectedRound] || []).length > 0) ? (
        <div
          className="ag-theme-alpine"
          id='main-grid'
          style={{ height: '385px', width: '100%' }}
        >
          <AgGridReact
            key={selectedRound}
            theme={themeQuartz}
            rowData={rowDefs}
            columnDefs={columnDefs}
            getRowClass={getRowClass}
            groupHeaderHeight={48}
            headerHeight={0}
            loading={loading}
          /></div>) : (
        <div className="empty-state">
          <h3>⏳ These games haven’t started yet</h3>
          <p>Check back after kickoff!</p>
        </div>
      )}
      <hr className="soft-divider" />
      <h3>Overall Scores</h3>
      <div className='grid-wrapper'>
        <div
          className="ag-theme-alpine total-scores"
          style={{ height: '345px', width: '336px' }}
        >
          <AgGridReact
            theme={themeQuartz}
            rowData={totalRowDefs}
            columnDefs={[{
              headerName: "Name",
              field: 'name',
              pinned: 'left'
            }, {
              headerName: "Total Score",
              field: 'score'
            }]}
            loading={loading}
          /></div>
      </div>
      <ScoringRules />
    </div>
  );
}

export default App;