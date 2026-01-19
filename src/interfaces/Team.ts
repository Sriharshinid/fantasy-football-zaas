import Defense from "./Defense";

export default class Team {
    constructor(
        public name: string,
        public id: string,
        public opponentId: string,
        public gameId: string,
        public defensiveScores: Defense
    ) {
        this.name = name;
        this.id = id;
        this.opponentId = opponentId;
        this.gameId = gameId;
        this.defensiveScores = defensiveScores;
    }
}