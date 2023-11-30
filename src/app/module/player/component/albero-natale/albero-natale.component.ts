import { Component } from '@angular/core';
import { StatePlayerService } from '../../services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'src/app/module/interface/player';

@Component({
  selector: 'app-albero-natale',
  templateUrl: './albero-natale.component.html',
  styleUrls: ['./albero-natale.component.css']
})
export class AlberoNataleComponent {
  
  player:Player | undefined;
  giorni: number[] | undefined;
  finestreAperte: number[] | undefined;

  ggToday: number = 0;

  constructor(private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService)
  {
    
    const playerId = this.route.snapshot.paramMap.get('id')!; 
    this.takePlayer(playerId);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');

    this.ggToday = Number(dd);



    this.playerStateService.getEventoNatale(playerId).then((resp) => {
      if(resp) {
        this.finestreAperte = resp;
        this.giorni = Array(25).fill(0).map((_, i) => i + 1);
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getEventoNatale','error');
      }
    });
  }

  apriFinestra(giorno:any) {
    if(this.isToday(giorno) && !this.isFinestraAperta(giorno)) {
      this.playerStateService.apriEventoNatale(giorno).then((resp) => {
        if(resp === true) {
          this.finestreAperte?.push(giorno)
          this.messageService.alert('Fatto!','Giorno '+giorno+' aperto, controlla il tuo inventario!','success');
          //this.playerStateService.resetPlayerState();
        } else {
          this.messageService.alert('Attenzione!','Errore durante la chiamata apriEventoNatale','error');
        }
      });
    }
  }

  isFinestraAperta(giorno:number) {
    return this.finestreAperte!.includes(giorno);
  }

  isToday(giorno:number) {
    return this.ggToday===giorno;
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getPlayer','error');
      }
    });
  }
}
