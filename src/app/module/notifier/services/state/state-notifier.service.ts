import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { NotifierService } from '../httpservice/notifier.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Injectable({
  providedIn: 'root'
})
export class StateNotifierService {

  reqsResponse:any | undefined;

  constructor(private spinnerService: NgxSpinnerService,
    private notifierService: NotifierService,
    private messageService: MessageService) {

  }

  resetState() {
    this.reqsResponse = undefined;
  }
  
  async inviaRichiesta(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.notifierService.newRequest(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async updateRequest(request:any) {
    this.spinnerService.show();
    let response;

    try {
      response = await firstValueFrom(this.notifierService.updateRequest(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }


    return response;
  }

  async getReqs(id:string) {
    this.spinnerService.show();
    
    if(!this.reqsResponse) {
      try {
        const response = await firstValueFrom(this.notifierService.getReqs(id));
        this.reqsResponse = response;
        this.spinnerService.hide();
      } catch (error:any) {
        this.spinnerService.hide();
        if(error.status===402) {
          this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        } else {
          this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero della history del market','error');
        }
      }
    } else {
      this.spinnerService.hide();
    }

    return this.reqsResponse;
  }

  async getDuelRec(id:string) {
    this.spinnerService.show();

    let duelRec;

    try {
      duelRec = await firstValueFrom(this.notifierService.getDuelRec(id));
      this.spinnerService.hide();
    } catch (error:any) {
      this.spinnerService.hide();
      if(error.status===402) {
        this.messageService.alert('Attenzione!','Non sono riuscito a registrare i duelli durante il training','error');
      } else {
        this.messageService.alert('Errore','Qualcosa è andato storto durante il recupero dei duelli eseguite durante i training','error');
      }
    }

    return duelRec;
  }

}
