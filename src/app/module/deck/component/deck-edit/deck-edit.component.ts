import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { StateDeckService } from '../../services/state/state-deck.service';
import Swal from 'sweetalert2';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { CdkDragDrop, CdkDragEnd, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FilterZainoService } from 'src/app/module/zaino/services/filter-zaino.service';

@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['../../styles/deck.css','./deck-edit.component.css']
})
export class DeckEditComponent implements OnInit {

  buttons: Button[] = [];

  deck: Deck | undefined;
  deckId: string | undefined;
  playerId: string | undefined;
  newNameDeck: string | undefined;

  viewFilter = false;
  searchFilter:any | undefined;

  zaino: Card[]=[];
  zainoBackup: Card[]=[];
  zainoAdd: Card[] = [];
  zainoDelete: Card[] = [];

  permission: boolean = true;

  dragDrop:boolean = false;
  dragging:boolean = false;
  stoAddCard:boolean = false;

  typeExtra = [65,8193, 8388609, 4161, 97, 4193, 637, 4257, 2097313, 8225, 12321, 8388641];

  etichette:any= {};

  constructor(private router: Router,
    private deckStateService: StateDeckService,
    private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService,
    private filterZainoService: FilterZainoService) { }

  ngOnInit(): void {
    this.permission = this.route.snapshot.paramMap.get('permission')! === "true";
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
      },
      {
        name: "REFRESH-BUTTON",
        code: "REFRESH",
        class: "fa fa-refresh"
      },
      {
        name: "SWITCH-BUTTON",
        code: "SWITCH",
        class: "fa-solid fa-image"
      },
      {
        name: "SAVE-BUTTON",
        code: "SAVE",
        class: "fa fa-save"
      }
    ];

    this.deckId = this.route.snapshot.paramMap.get('id')!;
    this.playerId = this.route.snapshot.paramMap.get('playerId')!;
    this.newNameDeck = this.route.snapshot.paramMap.get('newNameDeck')!;
    this.takeDeck();
    this.takeEtichette();
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.playerId!}]);
          break;
        case 'BACK':
          if(this.newNameDeck) {
            this.router.navigate(['/deck',{id:this.playerId!, permission: this.permission}]);
          } else {
            this.router.navigate(['/deckDetail',{id:this.deckId, playerId:this.playerId!, permission: this.permission}]);
          }
          break;
        case 'REFRESH': {
          this.deckStateService.resetDeck();
          this.playerStateService.resetZaino();
          this.takeDeck();
          break;
        }
        case 'SWITCH': {
          this.dragDrop=!this.dragDrop;
          break;
        }
        case 'SAVE':
          this.deck!.new=false;

          const extraIntoMain = this.checkExtraIntoMain();
          const mainIntoExtra = this.checkMainIntoExtra();

          if(!extraIntoMain && !mainIntoExtra) {
            this.deckStateService.updateDeck(this.deck!,this.deckId!).then((resp) => {
              if(resp) {
                this.deckStateService.resetPlayerDecks();
                this.messageService.alert('Fatto!','Deck salvato con successo.','success');
              } else {
                this.messageService.alert('Errore','Qualcosa è andato storto durante il salvataggio del deck','error');
              }
            });
          } else {
            if(extraIntoMain) {
              this.messageService.alert('Errore',"Il main deck non deve contenere carte di tipo fusione,synchro o xyz, per favore spostale nell'extra deck",'error');
            }

            if(mainIntoExtra) {
              this.messageService.alert('Errore',"L'extra deck deve contenere carte solo di tipo fusione,synchro o xyz, per favore sposta il resto delle carte nel main deck",'error');
            }
          }
          break;
      }
    }
  }

  retrieveCards(searchFilter: any) {
    this.searchFilter = searchFilter;

    if(this.zainoAdd.length>0) {
      for(let card of this.zainoAdd) {
        this.zainoBackup.push(card);
      }
      this.zainoAdd=[];
    }

    if(this.zainoDelete.length>0) {
      for(let card of this.zainoDelete) {
        let indiceBackup = this.zainoBackup.indexOf(card, 0)!;
        if (indiceBackup !== undefined && indiceBackup > -1) {
          this.zainoBackup.splice(indiceBackup, 1);
          break;
        }
      }
      this.zainoDelete=[];
    }

    this.zaino = this.filterZainoService.transform(this.zainoBackup,searchFilter);
  }

  registerZaino(removeCard:Card) {
    this.zainoDelete.push(removeCard);
  }

  removeCard(removeObject:any) {
    const card = removeObject.card;
    const type = removeObject.type;
    
    if(card) {
      let indice = -1;
      switch(type) {
        case 1:
          indice = this.deck?.main.indexOf(card, 0)!;
          if (indice !== undefined && indice > -1) {
            this.deck?.main.splice(indice, 1);
          }

          break;
        case 2:
          indice = this.deck?.extra.indexOf(card, 0)!;
          if (indice !== undefined && indice > -1) {
            this.deck?.extra.splice(indice, 1);
          }

          break;
        case 3:
          indice = this.deck?.side.indexOf(card, 0)!;
          if (indice !== undefined && indice > -1) {
            this.deck?.side.splice(indice, 1);
          }

          break;
      }

      this.zaino.push(card);
      this.zainoBackup.push(card);
    }
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
    if(!this.viewFilter) {
      this.retrieveCards(undefined);
    }
  }
  
  showCard(card:Card) {
    if(!this.dragging && !this.stoAddCard) {
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
      const previus = [ ...event.previousContainer.data];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
      const nextStep = [...event.previousContainer.data];
      const arrayTwo = previus.filter(item => !nextStep.includes(item));
      this.zainoAdd.push(arrayTwo[0])
    }
  }

  addCard(card:Card) {
    this.stoAddCard = true;
    if(card && this.typeExtra.includes(card.type)) {
      this.deck?.extra.push(card);
      this.deleteCardZaino(card);
      this.stoAddCard = false;
    } else if (card) {
      Swal.fire({
        title: 'Dove vuoi aggiungere questa carta?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Main',
        denyButtonText: 'Side',
        cancelButtonText: 'Annulla',
      }).then((result) => {
        if (result.isConfirmed) {

          this.deck?.main.push(card)
          this.deleteCardZaino(card);
          this.stoAddCard = false;

        } else if (result.isDenied) {

          this.deck?.side.push(card)
          this.deleteCardZaino(card);
          this.stoAddCard = false;

        }
      })
    }
  }

  private takeDeck() {
    if(this.newNameDeck) {
      this.deck = {
        id: this.deckId!,
        playerId: this.playerId!,
        name: this.newNameDeck!,
        new: false,
        main: [],
        extra: [],
        side: []
      }
      this.takeZaino();
    } else {
      this.deckStateService.getDeck(this.deckId!).then((resp) => {
        if(resp) {
          this.deck=resp;
          this.takeZaino();
        }
      });
    }
  }

  private countCard(iterObj: Card[], id: string) {
    let count = 0;
    for (const card of iterObj) {
      if (card.id === id) {
        count++;
      }
    }
    return count;
  }

  private takeZaino() {
    this.zaino = []
    this.playerStateService.getZaino(this.playerId!).then((resp) => {
      if(resp) {
        
        for (const card of resp) {
          let checkId = card.id
          let inUse = false;

          let iterObj = this.deck?.main.concat(this.deck?.extra, this.deck?.side)!;
          let countZaino = 0;
          let countZainoResp = 0;
          let countDeck = 0;

          if(iterObj.some(obj => obj.id === checkId)) {
            inUse = true;
            countZainoResp = this.countCard(resp,checkId);
            countDeck = this.countCard(iterObj,checkId);
          }

          if(!inUse) {
            this.zaino.push(card);
            this.zainoBackup.push(card);
          } else {
            if(countZainoResp>0 && countDeck>0) {
              countZaino = this.countCard(this.zaino,checkId);
              if(countZaino !== countZainoResp-countDeck) {
                for (let i = 0; i < countZainoResp-countDeck; i++) {
                  this.zaino.push(card);
                  this.zainoBackup.push(card);
                }
              }
            }
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

  private deleteCardZaino(card: Card) {
    let indice = this.zaino.indexOf(card, 0)!;
    if (indice !== undefined && indice > -1) {
      this.zaino.splice(indice, 1);
    }

    let indiceBackup = this.zainoBackup.indexOf(card, 0)!;
    if (indiceBackup !== undefined && indiceBackup > -1) {
      this.zainoBackup.splice(indiceBackup, 1);
    }
  }

  private checkExtraIntoMain(): boolean {
    let cardIntoMain = this.deck!.main.find(i => this.typeExtra.includes(i.type));
    return cardIntoMain ? true:false;
  }

  private checkMainIntoExtra(): boolean {
    let cardIntoExtra = this.deck!.extra.find(i => !this.typeExtra.includes(i.type));
    return cardIntoExtra ? true:false;
  }

  private takeEtichette() {
    this.playerStateService.getEtichette(this.playerId!).then((resp) => {
      if(resp) {
        this.etichette = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getEtichette','error');
      }
    });
  }

}