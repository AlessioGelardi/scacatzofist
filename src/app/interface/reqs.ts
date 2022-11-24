import { Status } from "../enum/status";
import { TypeMod } from "../enum/typeMod";

export interface Reqs {
    id: string,
    typeMod: TypeMod;
    playerIdReq: string;
    playerIdOppo: string;
    playerRichiedente: string;
    playerRicevente: string;
    dataIns: Date;
    status: Status;
}
