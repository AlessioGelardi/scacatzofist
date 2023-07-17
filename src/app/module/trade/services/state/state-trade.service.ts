import { Injectable } from '@angular/core';
import { TradeService } from '../httpservices/trade.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Injectable({
  providedIn: 'root'
})
export class StateTradeService {

  constructor(private spinnerService: NgxSpinnerService,
    private tradeService: TradeService,
    private messageService: MessageService) { }

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
}
