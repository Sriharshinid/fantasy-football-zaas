import './App.css'
import { useState, useEffect } from 'react';
import { getDefensiveScores, getPlayers, getPlayerScores, getTeams } from './utils/scores';
import { populateFantasyPlayerScores } from './utils/input';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ClientSideRowModelModule, ModuleRegistry, type ColDef, type ColGroupDef } from 'ag-grid-community';
import type FantasyPlayer from './interfaces/FantasyPlayer';
import { Position } from './interfaces/FantasyPlayer';
import { themeQuartz } from 'ag-grid-community';
import ScoringRules from './ScoringRules';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const GET_EVENTS_API = "https://site.web.api.espn.com/apis/personalized/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn";
const leftAlign = {
  'text-align': 'left',
};


function App() {
  // const [events, setEvents] = useState([] as string[]);
  // const [gameData, setGameData] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [columnDefs, setColumnDefs] = useState([] as (ColDef | ColGroupDef)[]);
  const [rowDefs, setRowDefs] = useState([] as any[]);

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
      const playerName = player.fantasyPlayerName.replaceAll(' ', '');
      columns.push({
        headerName: player.fantasyPlayerName,
        children: [{ field: `${playerName}-name`, headerName: '', cellStyle: leftAlign, }, { field: `${playerName}-score`, headerName: '', cellStyle: leftAlign, maxWidth: 70 }],
      })
    });

    return columns;
  };

  const getRowData = (players: FantasyPlayer[]): any[] => {
    const rows: any[] = [];
    let i = 0;
    [...Object.values(Position), 'Total'].forEach(position => {
      const row: { [x: string]: string | number; } = {};
      row['position'] = position;
      players.forEach(player => {
        const playerName = player.fantasyPlayerName.replaceAll(' ', '');
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
      const eventsResult = await fetch(GET_EVENTS_API);
      const eventsUnpacked = await eventsResult.json();

      // ["401772982","401772984","401772983","401772985"] <-- last weeks
      const eventIds = parseEventsData(eventsUnpacked);
      // setEvents(eventIds);

      const games = await getGames(eventIds);
      // setGameData(games);

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

      const scores = populateFantasyPlayerScores(getPlayerScores(allPlayerData, playerIdToNamesPromise), getDefensiveScores(allTeamData));

      setColumnDefs(getColumnDefs(scores));
      setRowDefs(getRowData(scores));
      setLoading(false);
    }

    fetchData().catch(error => console.error(error));
  }, []);

  const parseEventsData = (json: any): string[] => {
    const gameIds: string[] = [];
    json['sports'][0]['leagues'][0]['events'].forEach((ev: { [x: string]: any; }) => {
      gameIds.push(ev['id']);
    });
    return gameIds;
  };

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
    teamIds.forEach(teamId => promises.push(fetch(getRosterUrl(teamId))));
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
      <header className="page-header">
        <h1>🏈 Playoff Fantasy Football 2026 🏈</h1>
        <p>Divisional Round • Live Scores</p>
      </header>
      <div
        className="ag-theme-alpine"
        style={{ height: '385px', width: '100%' }}
      >
        <AgGridReact
          theme={themeQuartz}
          rowData={rowDefs}
          columnDefs={columnDefs}
          getRowClass={getRowClass}
          groupHeaderHeight={48}
          headerHeight={0}
          loading={loading}
        />
      </div>
      <ScoringRules/>
    </div>
  );
}

export default App;