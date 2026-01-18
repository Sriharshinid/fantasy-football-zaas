import './App.css'
import { useState, useEffect } from 'react';

const GET_EVENTS_API = "https://site.web.api.espn.com/apis/personalized/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn";

function App() {
  const [events, setEvents] = useState([] as string[]);

  useEffect(() => {
    fetch(GET_EVENTS_API)
      .then(response => response.json())
      .then(json => setEvents(parseEventsData(json)))
      .catch(error => console.error(error));
  }, []);

  const parseEventsData = (json: any): string[] => {
    const gameIds: string[] = [];
    json['sports'][0]['leagues'][0]['events'].forEach((ev: { [x: string]: any; }) => {
      gameIds.push(ev['id']);
    });
    return gameIds;
  };

  return (
    <div>
      {events ? <pre>{JSON.stringify(events)}</pre> : 'Loading...'}
    </div>
  );
}

export default App;