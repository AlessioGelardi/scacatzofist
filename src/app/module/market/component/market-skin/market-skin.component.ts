import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateMarketService } from '../../services/state/state-market.service';

@Component({
  selector: 'app-market-skin',
  templateUrl: './market-skin.component.html',
  styleUrls: ['./market-skin.component.css']
})
export class MarketSkinComponent {
  buttons: Button[] = [];

  player:Player | undefined;

  skinshop:any[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {

    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);
    this.takeSkins();

    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
      },
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      },
    ];
  }

  compraCard(sh: any) {
    alert('suca')
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.player!._id}]);
          break;
        case 'BACK':
          window.history.back();
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.player!._id}]);
          break;
      }
    }
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

  private takeSkins() {
    this.marketStateService.getSkins().then((resp) => {
      if(resp) {
        this.skinshop = resp;
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
