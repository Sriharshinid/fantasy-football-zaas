// from teams defensiveTouchdowns
// for the opposing team use - interceptions, fumblesLost (these go to defense of opposing team)

import Defense from "../interfaces/Defense";
import Player from "../interfaces/Player";
import Team from "../interfaces/Team";

// from players 
//    passing stat - passingYards, passingTouchdowns, interceptions
//    rushing stat - rushingYards, rushingTouchdowns
//    receiving - receivingYards, receivingTouchdowns
//    fumbles - fumblesLost
//    defensive - sacks
//    kicking - fieldGoalsMade/fieldGoalAttempts, extraPointsMade/extraPointAttempts, 

// things espn does not have (blocked punts, blocked kicks, and safeties)
// to find blocked punts - drives forEach if result === "BLOCKED PUNT" this means the opposing team gets a point for blocked punt in defense
// blocked kicks - result === "Blocked FG" opposing team gets the points
// safety - result === "SF" opposite team gets the points
// Field goals over 50 yards 
      // go through each scoring play look for existence in entities.plays
      // entities.plays[play_id], grab playId from also grab athlete key from here to match to playerId
      // match playerId to entities.athletes.fullName

// extracting teams
export const getTeams = (summary: any) => {
      const eventId = summary['header']['id'];
      const teamIds = summary['header']['competitions'][0]['competitors'].map((competitors: { [x: string]: any; }) => competitors['id']);
      const teams: { [x: string]: Team } = {};
      summary['boxscore']['teams'].forEach((team: { [x: string]: any; }) => {
            const name = team['team']['name'];
            const id = team['team']['id'];
            const opponentId = teamIds[0] == id ? teamIds[1] : teamIds[0];
            teams[id] = new Team(name, id, opponentId, eventId, new Defense());
      });
      getDefensiveStats(summary['boxscore'], summary['drives'], teams);
      return teams;
};

export const getPlayers = (summary: any) => {
      const players: { [x: string]: Player; } = {};
      (summary['boxscore']['players'] || []).forEach((pl: { [x: string]: any; }) => {
            // const teamId = pl['team']['id'];
            (pl['statistics'] || []).forEach((stat: { [x: string]: any; }) => {
                  switch (stat['name']) {
                        case 'passing':
                              const passingYardsIndex = stat['keys'].findIndex((key: string) => key == 'passingYards');
                              const passingTouchdownsIndex = stat['keys'].findIndex((key: string) => key == 'passingTouchdowns');
                              const interceptionsIndex = stat['keys'].findIndex((key: string) => key == 'interceptions');

                              (stat['athletes'] || []).forEach((athlete: { [x: string]: any; }) => {
                                    const athleteId: string = athlete['athlete']['id'];

                                    if (!(athleteId in players)) {
                                          players[athleteId] = new Player(athleteId);
                                    }

                                    players[athleteId].passingYards = +athlete['stats'][passingYardsIndex];
                                    players[athleteId].passingTouchdowns = +athlete['stats'][passingTouchdownsIndex];
                                    players[athleteId].interceptions = +athlete['stats'][interceptionsIndex];
                              });
                              break;
                        case 'rushing':
                              const rushingYardsIndex = stat['keys'].findIndex((key: string) => key == 'rushingYards');
                              const rushingTouchdownsIndex = stat['keys'].findIndex((key: string) => key == 'rushingTouchdowns');

                              (stat['athletes'] || []).forEach((athlete: { [x: string]: any; }) => {
                                    const athleteId: string = athlete['athlete']['id'];

                                    if (!(athleteId in players)) {
                                          players[athleteId] = new Player(athleteId);
                                    }

                                    players[athleteId].rushingYards = +athlete['stats'][rushingYardsIndex];
                                    players[athleteId].rushingTouchdowns = +athlete['stats'][rushingTouchdownsIndex];
                              });
                              break;
                        case 'receiving':
                              const receivingYardsIndex = stat['keys'].findIndex((key: string) => key == 'receivingYards');
                              const receivingTouchdownsIndex = stat['keys'].findIndex((key: string) => key == 'receivingTouchdowns');

                              (stat['athletes'] || []).forEach((athlete: { [x: string]: any; }) => {
                                    const athleteId: string = athlete['athlete']['id'];

                                    if (!(athleteId in players)) {
                                          players[athleteId] = new Player(athleteId);
                                    }

                                    players[athleteId].receivingYards = +athlete['stats'][receivingYardsIndex];
                                    players[athleteId].receivingTouchdowns = +athlete['stats'][receivingTouchdownsIndex];
                              });
                              break;
                        case 'fumbles':
                              const fumblesLostIndex = stat['keys'].findIndex((key: string) => key == 'fumblesLost');

                              stat['athletes'].forEach((athlete: { [x: string]: any; }) => {
                                    const athleteId: string = athlete['athlete']['id'];

                                    if (!(athleteId in players)) {
                                          players[athleteId] = new Player(athleteId);
                                    }

                                    players[athleteId].fumblesLost = +athlete['stats'][fumblesLostIndex];
                              });
                              break;
                        case 'kicking':
                              const fgIndex = stat['keys'].findIndex((key: string) => key == 'fieldGoalsMade/fieldGoalAttempts');
                              const extraPointsIndex = stat['keys'].findIndex((key: string) => key == 'extraPointsMade/extraPointAttempts');

                              (stat['athletes'] || []).forEach((athlete: { [x: string]: any; }) => {
                                    const athleteId: string = athlete['athlete']['id'];

                                    if (!(athleteId in players)) {
                                          players[athleteId] = new Player(athleteId);
                                    }
                                    
                                    const [fgMade, fgAttempts] = athlete['stats'][fgIndex].split('/');
                                    const [extraPtsMade, extraPtsAttempts] = athlete['stats'][extraPointsIndex].split('/');


                                    players[athleteId].fieldGoalsMade = +fgMade;
                                    players[athleteId].fieldGoalAttempts = +fgAttempts;
                                    players[athleteId].extraPointsMade = +extraPtsMade;
                                    players[athleteId].extraPointAttempts = +extraPtsAttempts;
                              });
                              break;                  
                        default:
                              break;
                  }
            });
      });

      (summary['scoringPlays'] || []).forEach((play: { [x: string]: any; }) => {
            const playId = play['$key'];
            if (summary['entities']?.['plays'] && (playId in summary['entities']['plays'])) {
                  const p = summary['entities']['plays'][playId];
                  const athleteId = p['participants'][0]['athlete']['$key'];
                  if (p['type']['abbreviation'] == 'FG' && p['statYardage'] >= 50) {
                        if (!(athleteId in players)) {
                              players[athleteId] = new Player(athleteId);
                        }
                        players[athleteId].numberOfFGOver50Yds += 1;
                  }
            }
      });

      return players;
};

export const getDefensiveStats = (boxscore: any, drives: any, teams: { [x: string]: Team }) => {
      // get defensiveTDs
      // get interceptions
      (boxscore['teams'] || []).forEach((teamScore: { [x: string]: { [x: string]: any; }; }) => {
            const teamId = teamScore['team']['id'];
            const team = teams[teamId];
            team.defensiveScores.defensiveTouchdowns = getStatisticForTeam('defensiveTouchdowns', teamScore);
            
            // fill in opposing team interceptions + fumbles lost
            teams[team.opponentId].defensiveScores.interceptions = getStatisticForTeam('interceptions', teamScore);
            teams[team.opponentId].defensiveScores.fumblesRecovered = getStatisticForTeam('fumblesLost', teamScore);
      });

      // get sacks for team by iterating through players
      (boxscore['players'] || []).forEach((playerInfo: { [x: string]: any; }) => {
            const teamId = playerInfo['team']['id'];
            let sacks = 0;
            const defensiveStats = (playerInfo?.['statistics'] || []).find((stat: { [x: string]: any; }) => stat['name'] == 'defensive');
            const sacksIndex = (defensiveStats?.['keys'] || []).findIndex((stat: string) => stat == 'sacks');
            (defensiveStats['athletes'] || []).forEach((athlete: { [x: string]: { [x: string]: any; }; }) => {
                  if (sacksIndex > -1) {
                        sacks += Number(athlete['stats'][sacksIndex]);
                  }  
            });

            teams[teamId].defensiveScores.sacks = sacks;
      });

      // to find blocked punts - drives forEach if result === "BLOCKED PUNT" this means the opposing team gets a point for blocked punt in defense
      // blocked kicks - result === "Blocked FG" opposing team gets the points
      // safety - result === "SF" opposite team gets the points
      (drives?.['previous'] || []).forEach((drive: any) => {
            const opTeamId = teams[drive['team']['$key']].opponentId;
            switch (drive['result']) {
                  case 'BLOCKED PUNT':
                        teams[opTeamId].defensiveScores.blockedPunts += 1;
                        break;
                  case 'Blocked FG':
                        teams[opTeamId].defensiveScores.blockedKicks += 1;
                        break;
                  case 'SF':
                        teams[opTeamId].defensiveScores.safties += 1;
                        break;
                  default:
                        break;
            }
      });
}

export const getStatisticForTeam = (statName: string, scores: any): number => {
      return scores['statistics'].find((stat: { [x: string]: string; }) => stat['name'] == statName)?.['value'] || 0;
};

// calculating player scores from raw stats
export const getPlayerScores = (players:  { [x: string]: Player; }, playerIdToName: { [x: string]: string; }): { [x: string]: number; } => {
      const playerScores: { [x: string]: number; } = {};

      Object.keys(players).forEach((playerId: string) => {
            let score = 0;
            score += (players[playerId].rushingTouchdowns * 6);
            score += (players[playerId].receivingTouchdowns * 6);

            score += (players[playerId].passingTouchdowns * 4);

            score += Math.floor(players[playerId].rushingYards/25)
            score += Math.floor(players[playerId].receivingYards/25)

            score += players[playerId].rushingYards > 100 ? 5 : 0;
            score += players[playerId].rushingYards > 200 ? 5 : 0;
            score += players[playerId].receivingYards > 100 ? 5 : 0;
            score += players[playerId].receivingYards > 200 ? 5 : 0;

            score += Math.floor(players[playerId].passingYards/50);
            score += players[playerId].passingYards > 300 ? 3 : 0;
            score += players[playerId].passingYards > 400 ? 3 : 0;

            score -= players[playerId].interceptions;
            score -= players[playerId].fumblesLost;

            score += players[playerId].extraPointsMade;
            score -= (players[playerId].extraPointAttempts - players[playerId].extraPointsMade);

            score += players[playerId].fieldGoalsMade * 3;
            score -= (players[playerId].fieldGoalAttempts - players[playerId].fieldGoalsMade) * 3;
            score += players[playerId].numberOfFGOver50Yds;

            playerScores[playerIdToName[playerId]] = score;
      });

      return playerScores;
}

export const getDefensiveScores = (teams:  { [x: string]: Team; }): { [x: string]: number; } => {
      const allTeamScores: { [x: string]: number; } = {};

      Object.keys(teams).forEach((teamId) => {
            let score = 0;

            score += teams[teamId].defensiveScores.sacks;
            score += (teams[teamId].defensiveScores.interceptions * 2);
            score += (teams[teamId].defensiveScores.fumblesRecovered * 2);
            score += (teams[teamId].defensiveScores.blockedPunts * 2);
            score += (teams[teamId].defensiveScores.blockedKicks * 2);
            score += (teams[teamId].defensiveScores.safties * 5);
            score += (teams[teamId].defensiveScores.defensiveTouchdowns * 6);

            allTeamScores[teams[teamId].name] = score;
      });

      return allTeamScores;
}

export const hasGameStarted = (header: any): boolean => {
      return new Date(header['competitions'][0]['date']) < new Date();
}