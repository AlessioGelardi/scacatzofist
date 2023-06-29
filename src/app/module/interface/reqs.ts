import { Status } from "../notifier/enum/status";
import { TypeMod } from "../play-now/enum/typeMod";
import { Card } from "./card";

export interface Reqs {
    id: string,
    typeMod: TypeMod;
    playerIdReq: string;
    playerIdOppo: string;
    playerRichiedente: string;
    playerRicevente: string;
    dataUpdate: Date;
    status: Status;
    vincita:any;
    perdita:any;
    vincitore?:string;
    plateReq?:Card[];
    plateOppo?:Card[];
}

export interface DictReqs {
    reqs?: { [key: string]: Reqs[] },
    page?: number
}