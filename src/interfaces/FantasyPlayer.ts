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
    QB = 'Quarterback',
    RB = 'Running Back',
    WR = 'Wide Receiver',
    TE = 'Tight End',
    K = 'Kicker',
    FLX = 'Flex (RB | WR | TE)',
    DEF = 'Defense & Special Teams'
}