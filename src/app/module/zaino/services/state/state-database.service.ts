import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom, map } from 'rxjs';
import { Card, Deck } from 'src/app/module/interface/card';
import { DatabaseService } from '../httpservices/database';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Injectable({
  providedIn: 'root'
})
export class StateDatabaseService {

  private cards?: Card[];

  constructor(private spinnerService: NgxSpinnerService,
    private databaseService: DatabaseService,
    private messageService: MessageService) {

  }

  resetState() {
    this.cards=undefined;
  }

  async getCards(formFilter:any) {
    this.spinnerService.show();

    try {
      const response = await firstValueFrom(this.databaseService.getCards(formFilter));
      this.cards = response;
      this.spinnerService.hide();
    } catch (error: any) {
      this.spinnerService.hide();
      if(error.status===402) {
        this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente non hai nessun deck','error');
      } else {
        this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero del deck','error');
      }
      return this.cards;
    }

    return this.cards;
  }
}
