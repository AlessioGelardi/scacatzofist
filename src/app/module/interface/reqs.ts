import { Status } from "../notifier/enum/status";
import { TypeMod } from "../play-now/enum/typeMod";

export interface Reqs {
    id: string,
    typeMod: TypeMod;
    playerIdReq: string;
    playerIdOppo: string;
    playerRichiedente: string;
    playerRicevente: string;
    dataIns: Date;
    dataUpdate?: Date;
    status: Status;
    vincita:any;
    perdita:any;
    vincitore?:string;
}
