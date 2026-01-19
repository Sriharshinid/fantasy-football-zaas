export default class FantasyPlayer {
    constructor(
        public fantasyPlayerName: string,
        public playerSelections: Selection[],
        public defensiveSelection: Selection,
        public totalScore: number = 0
    ) {}
}

export class Selection {
    constructor(
        public name: string,
        public position: Position,
        public score: number = 0
    ) {}
}

export enum Position {
    QB = 'QB',
    RB = 'RB',
    WR = 'WR',
    TE = 'TE',
    K = 'K',
    FLX = 'FLX',
    DEF = 'DEF_ST'
}