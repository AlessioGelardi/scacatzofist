export interface Card {
    _id?: string;
    name: string;
    type: string;
    description: string;
    atk: string;
    def: string;
}

export interface Deck {
    main: string[],
    extra: string[],
    side: string[]
}