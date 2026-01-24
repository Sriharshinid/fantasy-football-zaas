import FantasyPlayer from "../interfaces/FantasyPlayer";
import { Position, Selection } from "../interfaces/FantasyPlayer";

export const getFantasyPlayers = (input: { [x: string]: string; }[]): FantasyPlayer[] => {
    const players: FantasyPlayer[] = [];
    input.forEach((player) => {
        const selections: Selection[] = [
            new Selection(player[Position['QB']], Position.QB),
            new Selection(player[Position['RB']], Position.RB),
            new Selection(player[Position['WR']], Position.WR),
            new Selection(player[Position['TE']], Position.TE),
            new Selection(player[Position['K']], Position.K),
            new Selection(player[Position['FLX']], Position.FLX),
        ];
        players.push(new FantasyPlayer(player['Name'], selections, new Selection(player[Position.DEF], Position.DEF)));
    });

    return players;
};

export const populateFantasyPlayerScores = (input: { [x: string]: string; }[], playerScores: { [x: string]: number; }, teamScores: { [x: string]: number; }): FantasyPlayer[] => {

    const players = getFantasyPlayers(input);

    players.forEach((player) => {
        let totalScore = 0;

        const defensiveScore = teamScores[player.defensiveSelection.name];
        if (defensiveScore != null) {
            totalScore += defensiveScore;
            player.defensiveSelection.score = defensiveScore;
        }


        player.playerSelections.forEach((sel) => {
            const plScore = playerScores[sel.name];
            if (plScore != null) {
                totalScore += plScore;
                sel.score = plScore;
            }

        });

        player.totalScore = totalScore;
    });

    return players;
};
