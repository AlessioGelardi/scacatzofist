export interface Card {
    id: string;
    name: string;
    type: number;
    description: string;
    level: number;
    atk: number;
    def: number;
}

export interface Deck {
    id: string,
    playerId: string,
    name: string,
    main: Card[],
    extra: Card[],
    side: Card[]
}