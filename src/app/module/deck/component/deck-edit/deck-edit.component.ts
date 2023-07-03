import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Deck } from 'src/app/module/interface/card';
import { StateDeckService } from '../../services/state/state-deck.service';
import Swal from 'sweetalert2';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { CdkDragDrop, CdkDragEnd, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  filterName:string | undefined;

  zaino: Card[]=[];

  sliceLimit: number | undefined;
  sliceStart: number = 0;
  sliceEnd: number = 60;
  slice: number = 60;

  permission: boolean = true;

  dragDrop:boolean = false;
  dragging:boolean = false;

  typeExtra = [65, 129, 8193, 8388609, 4161, 97, 4193, 637, 161, 4257, 2097313, 8225, 12321, 8388641];

  constructor(private router: Router,
    private deckStateService: StateDeckService,
    private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) { }

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
            this.router.navigate(['/deckDetail',{id:this.deckId, permission: this.permission}]);
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

          if(this.dragDrop) {
            this.sliceEnd = 120;
            this.slice = 120;
          } else {
            this.sliceEnd = 60;
            this.slice = 60;
          }
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
    }
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
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

  addCard(card:Card) {
    if(card && this.typeExtra.includes(card.type)) {
      this.deck?.extra.push(card);
      this.deleteCardZaino(card);
      
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

        } else if (result.isDenied) {

          this.deck?.side.push(card)
          this.deleteCardZaino(card);

        }
      })
      
    }

  }

  backSlice() {
    this.sliceEnd -= this.slice;
    this.sliceStart -= this.slice;
  }

  continueSlice() {
    this.sliceStart += this.slice;
    this.sliceEnd += this.slice;
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

  private takeZaino() {
    this.zaino = []
    this.playerStateService.getZaino(this.playerId!).then((resp) => {
      if(resp) {
        
        for (const card of resp) {
          let checkId = card.id
          let inUse = false;

          if (this.deck?.main.concat(this.deck?.extra, this.deck?.side).some(obj => obj.id === checkId)) {
            inUse = true;
          }

          if(!inUse) {
            this.zaino.push(card)
          }
        }
        this.sliceLimit = this.zaino.length;
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
  }

  private checkExtraIntoMain(): boolean {
    let cardIntoMain = this.deck!.main.find(i => this.typeExtra.includes(i.type));
    return cardIntoMain ? true:false;
  }

  private checkMainIntoExtra(): boolean {
    let cardIntoExtra = this.deck!.extra.find(i => !this.typeExtra.includes(i.type));
    return cardIntoExtra ? true:false;
  }

}