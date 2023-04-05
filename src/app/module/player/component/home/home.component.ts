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

  constructor(private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService,
    private router: Router) {

  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);
    this.takeNumberNotify(playerId);
  }

  modificaDeck() {
    this.router.navigate(['/deck',{id:this.player?._id}]);
  }

  marketPlace() {
    this.router.navigate(['/marketplace',{id:this.player?._id}]);
  }

  giocaAdesso() {
    this.router.navigate(['/playnow',{id:this.player?._id}]);
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

