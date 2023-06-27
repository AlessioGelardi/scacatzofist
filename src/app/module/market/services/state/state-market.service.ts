import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { SellCard, SellPack } from 'src/app/module/interface/card';
import { MarketService } from '../httpservice/market.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Injectable({
  providedIn: 'root'
})
export class StateMarketService {

  private marketPlace?: SellCard[] | undefined;
  private marketPack?: SellPack[] | undefined;

  constructor(private spinnerService: NgxSpinnerService,
    private marketService: MarketService,
    private messageService: MessageService) {

  }

  resetState() {
    this.marketPlace = undefined;
    this.marketPack = undefined;
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
          this.messageService.alert('Attenzione','Il MarketPlace attualmente è vuoto','info');
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

  /*

  async getSellHistory(id:string) {
    this.spinnerService.show();
    
    if(!this.sellHistory) {
      try {
        const response = await firstValueFrom(this.marketService.getMarketPlaceById(id));
        this.sellHistory = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        if(error.status===402) {
          this.messageService.alert('Attenzione!','Nessuna carta in vendita al momento','info');
        } else {
          this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero della history del market','error');
        }
      }
    } else {
      this.spinnerService.hide();
    }

    return this.sellHistory;    
  }*/

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

  async buyPack(request: any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.acquistaPacchetti(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }  

  async buyCredits(playerId:string, numCredits:number) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.marketService.acquistaCrediti(playerId,numCredits));
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

}
