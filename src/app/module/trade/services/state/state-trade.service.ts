import { Injectable } from '@angular/core';
import { TradeService } from '../httpservices/trade.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { Trade } from 'src/app/module/interface/trade';

@Injectable({
  providedIn: 'root'
})
export class StateTradeService {

  private privateTrades?: Trade[] | undefined;

  constructor(private spinnerService: NgxSpinnerService,
    private tradeService: TradeService,
    private messageService: MessageService) {

  }

  resetPrivateTrades() {
    this.privateTrades=undefined;
  }

  async createTrade(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.tradeService.newTrade(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }

    return response;
  }

  async getPrivateTrade(playerId:string) {
    this.spinnerService.show();
    
    if(!this.privateTrades) {
      try {
        const response = await firstValueFrom(this.tradeService.getPrivateTrade(playerId));
        this.privateTrades = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del dailyshop','error');
      }
    } else {
      this.spinnerService.hide();
    }

    return this.privateTrades;    
  }

  async getTrade(tradeId:string) {
    this.spinnerService.show();

    let trade;
    
    try {
      const response = await firstValueFrom(this.tradeService.getTrade(tradeId));
      trade = response;
      this.spinnerService.hide();
    } catch (error:any) {
      this.spinnerService.hide();
      this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del dailyshop','error');
    }

    return trade;    
  }

  async updateTrade(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.tradeService.updateTrade(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }

    return response;
  }

  async deleteTrade(tradeId:string) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.tradeService.deleteTrade(tradeId));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }

    return response;
  }
  
}
