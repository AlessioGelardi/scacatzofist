export interface Trade {
    _id?: string;
    playerIdReq: string;
    playerNameReq: string;
    playerIdOppo: string;
    playerNameOppo: string;
    offerta?: any;
    richiesta?: any;
}
