export interface Trade {
    _id?: string;
    playerIdReq: string;
    playerNameReq: string;
    playerIdOppo: string;
    playerNameOppo: string;
    type: number;
    offerta?: any;
    richiesta?: any;
}
