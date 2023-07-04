export interface Tournament {
    _id?: string;
    name: string;
    regCostCoins: number;
    regCostCredits: number;
    playerOrg: string;
    type: number; //eliminatorie o classifica
    access: number; //privato o pubblico
    nreg: number;
    maxNReg: number;
    status: number;
}
