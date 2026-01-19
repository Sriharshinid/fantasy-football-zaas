import FantasyPlayer from "../interfaces/FantasyPlayer";
import { Position, Selection } from "../interfaces/FantasyPlayer";

const INPUT: { [x: string]: string; }[] = [
    {
        "Name": "Daniel Zaas",
        "QB": "C.J. Stroud",
        "RB": "Christian McCaffrey",
        "WR": "Puka Nacua",
        "TE": "Colston Loveland",
        "K": "Ka'imi Fairbairn",
        "FLX": "Jaxon Smith-Njigba",
        "DEF_ST": "Seahawks"
    },
    {
        "Name": "Leah",
        "QB": "Caleb Williams",
        "RB": "Christian McCaffrey",
        "WR": "Jaxon Smith-Njigba",
        "TE": "Colston Loveland",
        "K": "Jason Myers",
        "FLX": "Puka Nacua",
        "DEF_ST": "Patriots"
    },
    {
        "Name": "Kevin",
        "QB": "Brock Purdy",
        "RB": "James Cook III",
        "WR": "Jaxon Smith-Njigba",
        "TE": "Hunter Henry",
        "K": "Ka'imi Fairbairn",
        "FLX": "D'Andre Swift",
        "DEF_ST": "Patriots"
    },
    {
        "Name": "Joel Zaas",
        "QB": "Josh Allen",
        "RB": "Christian McCaffrey",
        "WR": "Jaxon Smith-Njigba",
        "TE": "Colston Loveland",
        "K": "Matt Prater",
        "FLX": "D'Ernest Johnson",
        "DEF_ST": "Bears"
    },
    {
        "Name": "Chris Gosselin",
        "QB": "Josh Allen",
        "RB": "Christian McCaffrey",
        "WR": "Christian Kirk",
        "TE": "Dalton Kincaid",
        "K": "Cairo Santos",
        "FLX": "Courtland Sutton",
        "DEF_ST": "Seahawks"
    },
    {
        "Name": "Ben",
        "QB": "Caleb Williams",
        "RB": "Christian McCaffrey",
        "WR": "Nico Collins",
        "TE": "Colston Loveland",
        "K": "Jason Myers",
        "FLX": "",
        "DEF_ST": "Texans"
    },
    {
        "Name": "Jeremy ",
        "QB": "Bo Nix",
        "RB": "Christian McCaffrey",
        "WR": "Puka Nacua",
        "TE": "Hunter Henry",
        "K": "Wil Lutz",
        "FLX": "Courtland Sutton",
        "DEF_ST": "Patriots"
    }
];

export const getFantasyPlayers = (): FantasyPlayer[] => {
    const players: FantasyPlayer[] = [];
    INPUT.forEach((player) => {
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

export const populateFantasyPlayerScores = (playerScores: { [x: string]: number; }, teamScores: { [x: string]: number; }): FantasyPlayer[] => {

    const players = getFantasyPlayers();

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
