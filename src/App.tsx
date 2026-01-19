import './App.css'
import { useState, useEffect } from 'react';
import { getDefensiveScores, getPlayers, getPlayerScores, getTeams } from './utils/scores';
import type Team from './interfaces/Team';
import type Player from './interfaces/Player';

const GET_EVENTS_API = "https://site.web.api.espn.com/apis/personalized/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn";

function App() {
  const [events, setEvents] = useState([] as string[]);
  const [gameData, setGameData] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState({} as { [x: string]: Team; })
  const [playerData, setPlayerData] = useState({} as { [x: string]: Player; })
  const [playerIdToNames, setPlayerIdToNames] = useState({} as { [x: string]: string; })

  useEffect(() => {
    const fetchData = async () => {
      const eventsResult = await fetch(GET_EVENTS_API);
      const eventsUnpacked = await eventsResult.json();

      const eventIds = parseEventsData(eventsUnpacked);
      setEvents(eventIds);

      const games = await getGames(eventIds);
      setGameData(games);

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
        setTeamData(allTeamData);
        setPlayerData(allPlayerData);

        const playerIdToNamesPromise = await getAllPlayerIdsToNames(Object.keys(allTeamData));
        setPlayerIdToNames(playerIdToNamesPromise);

        console.log(getDefensiveScores(allTeamData));
        console.log(getPlayerScores(allPlayerData, playerIdToNamesPromise));
        console.log(teamData, playerData, playerIdToNames);

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

  const getAllPlayerIdsToNames = async (teamIds: string[]):  Promise<{ [x: string]: string; }> => {
    const allPlayers: { [x: string]: string; } = {};
    const promises: any[] = [];
    teamIds.forEach(teamId => promises.push(fetch(getRosterUrl(teamId))));
    const results = await Promise.all(promises);
    const unpacked = [];
    for (let index = 0; index < results.length; index++) {
      const data = await results[index].json();
      unpacked.push(data);
    }

    unpacked.forEach((roster) => {
      roster['athletes'].forEach((athlete: { [x: string]: any; }) => {
        athlete['items'].forEach((person: { [x: string]: any; }) => {
          allPlayers[person['id']] = person['displayName'];
        });
      });
    });
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
      {events ? <pre>{JSON.stringify(events)}</pre> : 'Loading...'}
      {!loading ? <pre>{JSON.stringify(getTeams(gameData[0]))}</pre> : 'Loading...'}
      {!loading ? <pre>{JSON.stringify(getPlayers(gameData[0]))}</pre> : 'Loading...'}
    </div>
  );
}

export default App;