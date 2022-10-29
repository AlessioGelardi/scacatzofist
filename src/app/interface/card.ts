export interface Card {
    id: string;
    name: string;
    type: number;
    description: string;
    level: number;
    atk: number;
    def: number;
    state?: string;
}

export interface Deck {
    id: string,
    playerId: string,
    name: string,
    main: Card[],
    extra: Card[],
    side: Card[]
}

export interface SellCard {
    id: string,
    card: Card,
    prezzo?: string;
    playerId?: string;
}