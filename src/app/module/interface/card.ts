export interface Card {
    id: string;
    name: string;
    type: number;
    description: string;
    level: number;
    atk: number;
    def: number;
    state?: string;
    qnt?:number;
}

export interface Pack {
    cards: Card[];
}

export interface Deck {
    id: string,
    playerId: string,
    name: string,
    new: boolean,
    main: Card[],
    extra: Card[],
    side: Card[]
}

export interface SellCard {
    id: string,
    card: Card,
    prezzo?: string;
    playerId?: string;
    playerName?: string;
}