export interface Tournament {
    id?: string;
    name: string;
    regCostCoins: number;
    regCostCredits: number;
    orgName: string;
    type: number; //eliminatorie o classifica
    access: number; //privato o pubblico
    nreg: number;
    maxNReg: number;
    status: number;
    playersName?: string[];
    playersId?: string[];
}