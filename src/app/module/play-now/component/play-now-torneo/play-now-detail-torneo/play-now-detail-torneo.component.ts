import { Component, Input } from '@angular/core';
import { Tournament } from 'src/app/module/interface/tournament';
import { TipologieTorneo, AccessTypes } from '../enum/types';
import { Player } from 'src/app/module/interface/player';
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';

@Component({
  selector: 'detail-torneo',
  templateUrl: './play-now-detail-torneo.component.html',
  styleUrls: ['../styles/torneo.css','./play-now-detail-torneo.component.css']
})
export class PlayNowDetailTorneoComponent {

  @Input() tournament: Tournament | undefined;
  @Input() player: Player | undefined;
  @Input() imOrg: boolean = false;

  constructor(private messageService: MessageService,
    private notifierStateService: StateNotifierService,
    private playerStateService: StatePlayerService) { }

  public get TipologieTorneo() {
    return TipologieTorneo; 
  }

  public get AccessTypes() {
    return AccessTypes; 
  }

  partecipa() {
    if(this.tournament!.regCostCoins!==-1 && this.tournament!.regCostCoins!>Number(this.player?.coin!)) {
      this.messageService.alert('Attenzione!','Il tuo Bugdet in coin non consente di partecipare!','info');
    } else if(this.tournament!.regCostCredits!==-1 && this.tournament!.regCostCredits!>Number(this.player?.credits!)) {
      this.messageService.alert('Attenzione!','Il tuo Bugdet in crediti non consente di partecipare!','info');
    } else {
      let ioPart = this.tournament?.playersId!.find(i => i === this.player?._id);
      if(ioPart)  {
        this.messageService.alert('Attenzione!','Sei già stato iscritto al torneo','info');
      } else {

        let request: any = {}
        request.id = this.tournament?.id; 
        request.name = this.player!.name;
        request.playerId = this.player!._id!;
        

        this.notifierStateService.updateTournaments(request).then((resp) => {
          if(resp == true) {
            this.notifierStateService.resetTournaments();
            this.playerStateService.resetPlayerState();
            this.tournament?.playersName?.push(this.player!.name)
            this.tournament?.playersId?.push(this.player!._id!)
            this.tournament!.nreg!+=1;
        
            this.player!.coin = Number(this.player?.coin!)-this.tournament!.regCostCoins!;
            this.player!.credits = Number(this.player?.credits!)-this.tournament!.regCostCredits!;
    
          } else {
            //TO-DO gestione degli errori
            /*
            if(resp.status===402) {
              this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
            }
            */
    
            this.messageService.alert('Attenzione!','Errore durante la chiamata updateDuelRec','error');
          }
        });


      }
    }
  }

  iniziaTorneo() {
    if(this.tournament!.playersName!.length>=this.tournament!.maxNReg!) {
      this.messageService.alert('In progress...',"Numero massimo di partecipanti non ancora raggiunto!",'info');
    } else {
      //TO-DO random vs
    }
  }

  cancellaTorneo() {
    this.messageService.alert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  getNumbers(n: number): number[] {
    return Array(n).fill(0).map((_, index) => index);
  }
  

}
