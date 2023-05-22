import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { NotifierService } from '../httpservice/notifier.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { Reqs } from 'src/app/module/interface/reqs';

@Injectable({
  providedIn: 'root'
})
export class StateNotifierService {

  reqs: Reqs[] | undefined;
  myReqs: Reqs[] | undefined;

  constructor(private spinnerService: NgxSpinnerService,
    private notifierService: NotifierService,
    private messageService: MessageService) {

  }

  resetState() {
    this.reqs = undefined;
    this.myReqs = undefined;
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

  async getReqs(id:string, history:boolean = false) {
    this.spinnerService.show();
    
    if(!this.reqs) {
      try {
        const response = await firstValueFrom(this.notifierService.getReqs(id, false, history));
        this.reqs = response;
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

    return this.reqs;
  }

  async getMyReqs(id:string, history:boolean = false) {
    this.spinnerService.show();
    
    if(!this.myReqs) {
      try {
        const response = await firstValueFrom(this.notifierService.getReqs(id,true, history));
        this.myReqs = response;
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

    return this.myReqs;
  }

  async createDuelRec(request:any) {
    this.spinnerService.show();

    let response;
    try {
      response = await firstValueFrom(this.notifierService.createDuelRec(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }

    return response;
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

  async updateDuelRec(request:any) {
    this.spinnerService.show();

    let response;
    try {
      response = await firstValueFrom(this.notifierService.updateDuelRec(request));
      this.spinnerService.hide();
    } catch (error: any) {
      /* TO-DO [WinError 3] Impossibile trovare il percorso specificato: 'deck\\\\Ingranaggio Antico1.ydk' -> 'deck\\\\Ingranaggio Antico.ydk'*/
      response = error;
      this.spinnerService.hide();
    }

    return response;
  }

}
