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
    name: string,
    main: Card[],
    extra: Card[],
    side: Card[]
}