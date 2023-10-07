import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateTradeService } from '../../services/state/state-trade.service';
import Swal from 'sweetalert2';
import { StateDeckService } from 'src/app/module/deck/services/state/state-deck.service';

@Component({
  selector: 'trade-new',
  templateUrl: './trade-new.component.html',
  styleUrls: ['../../styles/trade.css','./trade-new.component.css']
})
export class TradeNewComponent {

  buttons: Button[] = [];

  player:Player | undefined;
  
  filterName:string | undefined;
  selectPlayerId: string | undefined;
  selectPlayerName:string | undefined;

  players: Player[] = [];

  private: boolean = false;
  public:boolean = false;
  tradeDeck: boolean = false;
  tradeCard: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService) { }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-arrow-left"
      }
    ];

    const playerId = this.route.snapshot.paramMap.get('id')!; 
    this.takePlayer(playerId);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.deckStateService.resetPlayerDecks();
          this.router.navigate(['/home']);
          break;
        case 'BACK':
          this.deckStateService.resetPlayerDecks();
          if(this.tradeCard || this.tradeDeck) {
            if(this.tradeCard) {
              this.tradeCard=false;
            }
            if(this.tradeDeck) {
              this.tradeDeck=false;
            }
          } else {
            if(this.selectPlayerId) {
              this.selectPlayerId=undefined;
              this.selectPlayerName=undefined;
            } else {
              if(this.private || this.public) {
                if(this.private) {
                  this.private=false
                }
                if(this.public) {
                  this.public=false
                }
              } else {
                this.router.navigate(['/trade']);
              }
            }
          }
          
          break;
      }
    }
  }

  pubblico() {
    this.messageService.alert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
  }

  privato() {
    this.private=true;
  }

  onTradeDeck() {
    this.tradeDeck=true;
  }

  onTradeCard() {
    this.tradeCard=true;
  }

  selectPlayer(playerIdOppo: string,name:string) {
    this.selectPlayerId = playerIdOppo;
    this.selectPlayerName = name;
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.takeAllPlayers(playerId);
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

  private takeAllPlayers(id:string) {
    this.players=[];
    this.playerStateService.getAllPlayers(id).then((resp) => {
      if(resp) {
        this.players = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getAllPlayers','error');
      }
    });
  }
}
