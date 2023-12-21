import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from 'src/app/module/interface/player';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';


@Component({
  selector: 'player-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/player.css','./home.component.css']
})
export class HomeComponent implements OnInit {

  player:Player | undefined;
  numberNotify:number | undefined;

  bonus:boolean = false;
  expBonus:boolean = false;
  dailyshopdoppio:boolean = false;
  ishorusEye:boolean = false;

  oggiDate:Date = new Date();
  
  constructor(private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService,
    private router: Router) {
  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);
    this.takeNumberNotify(playerId);

    switch(this.oggiDate.getDay()) {
      case 1: //lunedi
        this.dailyshopdoppio = true;
        break;
      case 5: //venerdi
        this.ishorusEye = true;
        this.playerStateService.setHorusEye(this.ishorusEye);
        break;
      case 6: //sabato
        this.expBonus = true;
        this.playerStateService.setExpBonus(this.expBonus);
        break;
      case 0: //domenica
        this.bonus = true;
        this.playerStateService.setGuadagniBonus(this.bonus);
        break; 
    }
  }

  modificaDeck() {
    this.router.navigate(['/deck',{id:this.player?._id, permission: !(this.player?.ruolo! === 3)}]);
  }

  searchCard() {
    this.router.navigate(['/database',{id:this.player?._id}]);
  }

  horusEye() {
    this.router.navigate(['/horuseye',{id:this.player?._id}]);
  }

  marketPlace() {
    this.router.navigate(['/market',{id:this.player?._id}]);
  }

  giocaAdesso() {
    this.router.navigate(['/playnow',{id:this.player?._id, bonus:this.bonus}]);
  }

  trade() {
    this.router.navigate(['/trade',{id:this.player?._id}]);
  }

  alberoMagico() {
    this.router.navigate(['/alberomagico',{id:this.player?._id}]);
  }

  regaloSpeciale() {
    this.playerStateService.apriEventoNatale(this.oggiDate.getDate()).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Hai ricevuto un regalo speciale, i tuoi crediti e i tuoi coin sono stati accreditati!','success');
        //this.playerStateService.resetPlayerState();
      } else {
        this.messageService.alert('Attenzione!','Errore durante la chiamata regaloSpeciale','error');
      }
    });
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
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

  private takeNumberNotify(playerId: string) {
    /*
    this.spinnerService.show();
    this.httpPlayerService.getNumberNotify(playerId).subscribe({
      next: (result) => {
        if(result>0){
          this.numberNotify = result;
        }
      }, // completeHandler
      error: (error: any) => {
        this.spinnerService.hide();
        if(error.status===402) {
          this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });*/
  }

}

