export default class Player {
    constructor(
        // public name: string,
        public id: string,
        // public type: PlayerType,
        // public teamId: string,
        public passingYards: number = 0,
        public passingTouchdowns: number = 0,
        public interceptions: number = 0,
        public rushingYards: number = 0,
        public rushingTouchdowns: number = 0,
        public receivingYards: number = 0,
        public receivingTouchdowns: number = 0,
        public fumblesLost: number = 0,
        public fieldGoalsMade: number = 0,
        public fieldGoalAttempts: number = 0,
        public extraPointsMade: number = 0,
        public extraPointAttempts: number = 0,
        public numberOfFGOver50Yds: number = 0,
    ) { }
}

export enum PlayerType {
    QB = 'QB',
    RB = 'RB',
    WR = 'WR',
    TE = 'TE',
    K = 'K',
    FLX = 'FLX'
}