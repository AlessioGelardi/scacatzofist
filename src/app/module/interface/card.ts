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

export interface Pack {
    id:string;
    name: string;
    src:string;
    taglia:number;
    cards: Card[];
    type: number[];
    level: number[];
    isDaily:boolean;
    isDeck: boolean;
    deckId?: string;
    monster:boolean;
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
    dailyShop?: boolean;
}

export interface SellPack {
    id: string,
    packId:string,
    name:string,
    taglia: number;
    src:string;
    prezzo?: string;
    playerId?: string;
    playerName?: string;
}