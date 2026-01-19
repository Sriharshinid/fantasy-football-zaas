export default class Defense {
    constructor(
        public defensiveTouchdowns: number = 0,
        public interceptions: number = 0,
        public fumblesRecovered: number = 0,
        public sacks: number = 0,
        public blockedPunts: number = 0,
        public blockedKicks: number = 0,
        public safties: number = 0,
    ) {}
}