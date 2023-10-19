export interface Player {
    _id?: string;
    name: string;
    pss?: string;
    email?: string;
    domanda?: string;
    risposta?: string;
    coin?: number;
    credits?: number;
    ruolo?: number;
    changeNameCnt?:number;
    level?:number;
    currentExp?:number;
    maxExp?:number;
    reward?:boolean;
}
