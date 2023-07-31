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

  createMyTrade = new FormGroup({
    coins: new FormControl(0),
    credits: new FormControl(0),
    cards: new FormControl([])
  });

  createYourTrade = new FormGroup({
    coins: new FormControl(0),
    credits: new FormControl(0),
    cards: new FormControl([])
  });

  players: Player[] = [];
  showPlayers:boolean = false;
  filterName:string | undefined;
  selectPlayerId: string | undefined;
  selectPlayerName:string | undefined;

  myZaino: Card[] = [];
  oppoZaino: Card[] = [];
  myPlate: Card[] = [];
  oppoPlate: Card[] = [];

  dragging: boolean = false;

  private: boolean = false;
  
  viewFilterZaino: boolean = false;
  viewFilterOppo: boolean = false;
  searchFilterZaino:any | undefined;
  searchFilterOppo:any | undefined;

  myDecks:Deck[] = [];
  oppoDecks:Deck[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private deckStateService: StateDeckService,
    private playerStateService: StatePlayerService,
    private tradeStateService: StateTradeService) { }

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
          this.router.navigate(['/home']);
          break;
        case 'BACK':
          if(this.private) {
            if(!this.showPlayers) {
              this.showPlayers=true;
            } else {
              this.private=false;
            }
          } else {
            this.router.navigate(['/trade']);
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
    this.takeAllPlayers(this.player?._id!);
  }

  selectPlayer(playerIdOppo: string,name:string) {
    this.showPlayers = false;
    this.selectPlayerId = playerIdOppo;
    this.selectPlayerName = name;

    this.takeDecksByIdPlayer(this.selectPlayerId);    
  }

  create() {
    if(this.myPlate.length>0 && this.oppoPlate.length>0) {
      Swal.fire({
        title: 'Sei sicuro?',
        text: "Se sicuro di confermare il trade?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, conferma trade!'
      }).then((result) => {
        if (result.isConfirmed) {

          let cardsRequest = []
          for(let card of this.myPlate) {
            cardsRequest.push(card.id)
          }

          let request: any = {};
          request.playerIdReq = this.player?._id;
          request.playerNameReq = this.player?.name;
          request.richiesta = {
            "coin": this.createMyTrade.value.coins,
            "credits": this.createMyTrade.value.credits,
            "cards": cardsRequest
          }

          let cardsOffert = []
          for(let card of this.oppoPlate) {
            cardsOffert.push(card.id)
          }

          request.playerIdOppo = this.selectPlayerId;
          request.playerNameOppo = this.selectPlayerName;
          request.offerta = {
            "coin": this.createYourTrade.value.coins,
            "credits": this.createYourTrade.value.credits,
            "cards": cardsOffert
          }
          request.status = 1;
    
          this.tradeStateService.createTrade(request).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Trade creato!','success');
              this.router.navigate(['/trade']);
            } else {
              this.messageService.alert('Errore',"Errore durante la creazione del trade",'error');
            }
          });

        }
      })
    } else {
      this.messageService.alert('Attenzione!','Inserire almeno delle carte per creare il trade!','error');
    }
  }

  doFilterZaino() {
    this.viewFilterZaino = !this.viewFilterZaino;
  }

  doFilterOppo() {
    this.viewFilterOppo = !this.viewFilterOppo;
  }

  retrieveCardsMyZaino(searchFilter: any) {
    if(searchFilter) {
      this.searchFilterZaino = searchFilter;
    }
  }

  retrieveCardsOppo(searchFilter: any) {
    if(searchFilter) {
      this.searchFilterOppo = searchFilter;
    }
  }

  showCard(card:Card) {
    if(!this.dragging) {
      this.messageService.showDetailCard(card);
    }
  }

  onDragStart(): void {
    this.dragging = true;
  }
  
  onDragEnd(): void {
    setTimeout(() => {
      this.dragging = false;
    }, 10);
  }

  onDrop(event: CdkDragDrop<Card[]>) {
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data,event.previousIndex,event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
  }

  private takeZaino(playerId:string) {
    if(this.player!._id === playerId) {
      this.playerStateService.getZaino(playerId).then((resp) => {
        if(resp) {
          for (const card of resp) {
            let checkId = card.id
            let inUse = false;
    
            for(const deck of this.myDecks) {
              if (deck.main.concat(deck.extra, deck.side).some(obj => obj.id === checkId)) {
                inUse = true;
              }
            }
    
            if(!inUse) {
              this.myZaino.push(card)
            }
          }
        } else {
          //TO-DO gestione degli errori
          /*
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
          */
  
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    } else {
      this.playerStateService.getZainoNoCache(playerId).then((resp) => {
        if(resp) {
          for (const card of resp) {
            let checkId = card.id
            let inUse = false;
    
            for(const deck of this.oppoDecks) {
              if (deck.main.concat(deck.extra, deck.side).some(obj => obj.id === checkId)) {
                inUse = true;
              }
            }
    
            if(!inUse) {
              this.oppoZaino.push(card)
            }
          }
        } else {
          //TO-DO gestione degli errori
          /*
          if(resp.status===402) {
            this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
          }
          */
  
          this.messageService.alert('Attenzione!','Errore durante la chiamata getZaino','error');
        }
      });
    }

  }

  private takeAllPlayers(id:string) {
    
    this.playerStateService.getAllPlayers(id).then((resp) => {
      if(resp) {
        this.showPlayers = true;
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

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.takeDecksByIdPlayer(playerId);
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

  private takeDecksByIdPlayer(playerId:string) {
    let decks:any = {}
    this.deckStateService.resetPlayerDecks();
    this.deckStateService.getDecks(playerId).then((resp) => {
      decks = resp!;

      for(let x of decks) {
        this.takeDeck(x["id"],playerId)
      }
      this.takeZaino(playerId);
    });
  }

  private takeDeck(deckId:string,playerId:string) {
    this.deckStateService.resetDeck();
    if(this.player!._id === playerId) {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          this.myDecks.push(resp);
        }
      });
    } else {
      this.deckStateService.getDeck(deckId).then((resp) => {
        if(resp) {
          this.oppoDecks.push(resp);
        }
      });
    }
  }
}
