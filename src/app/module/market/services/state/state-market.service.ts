import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { Card, SellCard, SellPack } from 'src/app/module/interface/card';
import { MarketService } from '../httpservice/market.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Injectable({
  providedIn: 'root'
})
export class StateMarketService {

  private marketPlace?: SellCard[] | undefined;
  private marketPack?: SellPack[] | undefined;

  private dailyShop?: SellCard[] | undefined;

  private selectedTexture?: any | undefined;

  private packs?: any[];

  private horusEye?: any | undefined;

  constructor(private spinnerService: NgxSpinnerService,
    private marketService: MarketService,
    private messageService: MessageService) {

  }

  resetDailyShop() {
    this.dailyShop = undefined;
  }

  resetMarketPack() {
    this.marketPack = undefined;
  }

  resetMarketPlace() {
    this.marketPlace = undefined;
  }
  
  resetPacks() {
    this.packs = undefined;
  }

  resetSelectedTexture() {
    this.selectedTexture = undefined;
  }
  
  resetHorusEye() {
    this.horusEye = undefined;
  }

  resetState() {
    this.marketPlace = undefined;
    this.marketPack = undefined;
    this.dailyShop = undefined;
    this.packs = undefined;
    this.selectedTexture = undefined;
    this.horusEye = undefined;
  }

  async getPacks(typePack:number) {
    this.spinnerService.show();

    if(!this.packs) {
      try {
        const response = await firstValueFrom(this.marketService.getPacks(typePack));
        this.packs = response;
        this.spinnerService.hide();
      } catch(error:any) {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }

    return this.packs;
  }

  async getMarketPlace() {
    this.spinnerService.show();
    
    if(!this.marketPlace) {
      try {
        const response = await firstValueFrom(this.marketService.getMarketplace());
        this.marketPlace = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        if(error && error.status === 402) {
          //this.messageService.alert('Attenzione','Il MarketPlace attualmente è vuoto','info');
        } else {
          this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del market','error');
        }
      }
    } else {
      this.spinnerService.hide();
    }

    return this.marketPlace;    
  }

  async getMarketPack() {
    this.spinnerService.show();
    
    if(!this.marketPack) {
      try {
        const response = await firstValueFrom(this.marketService.getMarketpack());
        this.marketPack = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        if(error && error.status === 402) {
          this.messageService.alert('Attenzione','Il MarketPlace attualmente è vuoto','info');
        } else {
          this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del market','error');
        }
      }
    } else {
      this.spinnerService.hide();
    }

    return this.marketPack;    
  }

  async getDailyShop(playerId:string,doppio:boolean) {
    this.spinnerService.show();
    
    if(!this.dailyShop) {
      try {
        let request: any = {}
        request.playerId = playerId;
        request.doppio = doppio;
        const response = await firstValueFrom(this.marketService.getDailyShop(request));
        this.dailyShop = response.sort((a, b) => Number(b.card.type) - Number(a.card.type)).sort((a, b) => Number(b.prezzo) - Number(a.prezzo));
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del dailyshop','error');
      }
    } else {
      this.spinnerService.hide();
    }

    return this.dailyShop;    
  }

  async venditaCard(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.venditaCard(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async deleteSellCard(sellCardId:string, cardId: string, playerId:string) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.deleteSellCard(sellCardId,cardId,playerId));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async deleteSellPack(sellPackId:string) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.deleteSellPack(sellPackId));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async buyCard(sellCard:SellCard, playerIdAcquista:string) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.acquistaCard(sellCard,playerIdAcquista));
      if(response) {
        let cardDelete = this.marketPlace!.find(i => i.id === sellCard.id);
        if(cardDelete) {
          const index = this.marketPlace!.indexOf(cardDelete, 0);
          this.marketPlace!.splice(index,1);
        }
      }
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async buyCardDailyShop(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.acquistaCardDailyShop(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async buyPack(request: any, isPublicSell: boolean) {
    this.spinnerService.show();
    let response;

    try {
      if(isPublicSell) {
        response = await firstValueFrom(this.marketService.acquistoPack(request));
      } else {
        response = await firstValueFrom(this.marketService.acquistaPacchetti(request));
      }
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }  

  async buyCoins(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.acquistaCoins(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async refreshDailyShop(playerId:string, doppio:boolean) {
    this.spinnerService.show();
    let response;

    try {
      let request: any = {}
      request.playerId = playerId;
      request.doppio = doppio;
      response = await firstValueFrom(this.marketService.refreshDailyShop(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async openPack(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.apriPack(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async venditaPack(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.venditaPack(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async getSkins(type:number) {
    this.spinnerService.show();
    let skinShop;
    const response = await firstValueFrom(this.marketService.getSkins(type));
    skinShop = response;
    this.spinnerService.hide();

    return skinShop;    
  }

  async getSelectedTexture(id:string) {
    this.spinnerService.show();
    
    if(!this.selectedTexture) {
      try {
        const response = await firstValueFrom(this.marketService.getSelectedTexture(id));
        this.selectedTexture = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del dailyshop','error');
      }
    } else {
      this.spinnerService.hide();
    }

    return this.selectedTexture;    
  }

  async acquistaTexture(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.acquistaTexture(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async selezionaTexture(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.selezionaTexture(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async getHorusEye(request:any) {
    this.spinnerService.show();
    
    if(!this.horusEye) {
      try {
        const response = await firstValueFrom(this.marketService.getHorusEye(request));
        this.horusEye = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del horusEye','error');
      }
    } else {
      this.spinnerService.hide();
    }

    return this.horusEye;    
  }

  async postHorusEye(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.postHorusEye(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }
}
