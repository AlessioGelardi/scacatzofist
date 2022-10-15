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
    main: string[],
    extra: string[],
    side: string[]
}