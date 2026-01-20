import FantasyPlayer from "../interfaces/FantasyPlayer";
import { Position, Selection } from "../interfaces/FantasyPlayer";

const INPUT: { [x: string]: string; }[] = [
    {
        "Name": "Daniel Zaas",
        "Quarterback": "C.J. Stroud",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Puka Nacua",
        "Tight End": "Colston Loveland",
        "Kicker": "Ka'imi Fairbairn",
        "Flex (RB | WR | TE)": "Jaxon Smith-Njigba",
        "Defense & Special Teams": "Seahawks"
    },
    {
        "Name": "Leah",
        "Quarterback": "Caleb Williams",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Jaxon Smith-Njigba",
        "Tight End": "Colston Loveland",
        "Kicker": "Jason Myers",
        "Flex (RB | WR | TE)": "Puka Nacua",
        "Defense & Special Teams": "Patriots"
    },
    {
        "Name": "Kevin",
        "Quarterback": "Brock Purdy",
        "Running Back": "James Cook III",
        "Wide Receiver": "Jaxon Smith-Njigba",
        "Tight End": "Hunter Henry",
        "Kicker": "Ka'imi Fairbairn",
        "Flex (RB | WR | TE)": "D'Andre Swift",
        "Defense & Special Teams": "Patriots"
    },
    {
        "Name": "Joel Zaas",
        "Quarterback": "Josh Allen",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Jaxon Smith-Njigba",
        "Tight End": "Colston Loveland",
        "Kicker": "Matt Prater",
        "Flex (RB | WR | TE)": "D'Ernest Johnson",
        "Defense & Special Teams": "Bears"
    },
    {
        "Name": "Chris Gosselin",
        "Quarterback": "Josh Allen",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Christian Kirk",
        "Tight End": "Dalton Kincaid",
        "Kicker": "Cairo Santos",
        "Flex (RB | WR | TE)": "Courtland Sutton",
        "Defense & Special Teams": "Seahawks"
    },
    {
        "Name": "Ben",
        "Quarterback": "Caleb Williams",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Nico Collins",
        "Tight End": "Colston Loveland",
        "Kicker": "Jason Myers",
        "Flex (RB | WR | TE)": "",
        "Defense & Special Teams": "Texans"
    },
    {
        "Name": "Jeremy ",
        "Quarterback": "Bo Nix",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Puka Nacua",
        "Tight End": "Hunter Henry",
        "Kicker": "Wil Lutz",
        "Flex (RB | WR | TE)": "Courtland Sutton",
        "Defense & Special Teams": "Patriots"
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
