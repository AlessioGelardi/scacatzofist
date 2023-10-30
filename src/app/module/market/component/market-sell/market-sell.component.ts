import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card } from 'src/app/module/interface/card';
import { StateMarketService } from '../../services/state/state-market.service';
import Swal from 'sweetalert2';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { Player } from 'src/app/module/interface/player';

@Component({
  selector: 'app-market-sell',
  templateUrl: './market-sell.component.html',
  styleUrls: ['./market-sell.component.css','../../styles/market.css']
})
export class MarketSellComponent implements OnInit {

  buttons: Button[] = [];

  player:Player | undefined;

  playerId:string | undefined;

  viewFilter = false;
  searchFilter:any | undefined;

  viewEtichetta = false;

  zaino: Card[] | undefined=[];

  sliceLimit: number | undefined;
  sliceStart: number = 0;
  sliceEnd: number = 60;
  slice: number = 60;

  viewCard: boolean = false;

  etichetta?: string;
  color:string = "#ffffff";

  etichette:any= {};

  isDropdownVisible = false;
  dropdownLeft = 0; // Posizione orizzontale del menu
  dropdownTop = 0;  // Posizione verticale del menu
  @ViewChildren('buttonElement') buttonElements?: QueryList<ElementRef>;

  cardEticSelected?: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) {

  }

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
        class: "fa fa-undo"
      },
      {
        name: "INVENTORY-BUTTON",
        code: "INVENTORY",
        class: "fa fa-briefcase"
      },
      {
        name: "SWITCH-BUTTON",
        code: "SWITCH",
        class: "fa-solid fa-image"
      },
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      },
      {
        name: "SKIN-BUTTON",
        code: "SKIN",
        class: "fa fa-film"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(this.playerId!);
    this.takeEtichette();
    //this.takeZaino();
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.playerId!}]);
          break;
        case 'BACK':
          window.history.back();
          break;
        case 'INVENTORY':
          this.router.navigate(['/inventory',{id:this.playerId!}]);
          break;
        case 'SWITCH': 
          this.viewCard = !this.viewCard;
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.playerId!}]);
          break;
        case 'SKIN':
          this.router.navigate(['/skin',{id:this.playerId!}]);
          break;
      }
    }
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  sellCard(card:Card) {
    Swal.fire({
      title: 'Vendi la tua carta',
      text: 'Scegli il prezzo',
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Vendi',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {
        if(result.value>500) {
          let request:any = {};
          request.playerId = this.playerId!;
          request.cardId = card.id;
          request.prezzo = result.value;
          request.isPack = false;
          request.name = card.name;

          this.marketStateService.venditaCard(request).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Vendita creata con successo!','success');
  
              let cardDelete = this.zaino!.find(i => i.id === card.id);
              if(cardDelete) {
                const index = this.zaino!.indexOf(cardDelete, 0);
                this.zaino!.splice(index,1);
              }
              this.marketStateService.resetState();
              //this.takeHistory();
  
            } else {
              if(resp && resp.status !== 200) {
                if(resp.status === 403) {
                  let msg = "";
                  resp.error.forEach((z: any) => msg+=z.name+" x"+z.count+" ");
                  this.messageService.alert('Attenzione','Carta presente nel deck '+msg,'error');
                } else {
                  this.messageService.alert('Errore','Qualcosa è andato storto durante la creazione della vendita','error');
                }
              }
            }
          });
        } else {
          this.messageService.alert('Attenzione','Il prezzo deve essere almeno maggiore di 500','info');
        }
        
      }
    })
  }

  openMenuEtichetta(buttonElement: HTMLButtonElement, card:Card) {

    if(!card.etich) {
      if(this.etichette !== undefined && this.etichette.length>0) {
        const buttonRect = buttonElement.getBoundingClientRect();
  
        if(this.isDropdownVisible && this.dropdownLeft === (buttonRect.left - 80) && this.dropdownTop === (buttonRect.bottom+window.scrollY)) {
          this.isDropdownVisible = false;
        } else {
          // Calcola la posizione in base alle coordinate del click
          this.dropdownLeft = buttonRect.left - 80;
          this.dropdownTop = buttonRect.bottom + window.scrollY;
    
          // Mostra il menu
          this.isDropdownVisible = true;
    
          this.cardEticSelected=card.id;
        }
      } else {
        this.messageService.alert('Nessuna etichetta!','Ricordati di creare almeno una etichetta','info');
      }
    } else {
      Swal.fire({
        title: 'Attenzione!',
        icon: 'warning',
        text: 'Etichetta "'+card.etich.name+'" presente, vuoi cancellarla?',
        showCancelButton: true,
        confirmButtonText: 'Cancella',
        cancelButtonText: 'No, annulla!',
        showLoaderOnConfirm: true
      }).then((result) => {
        if (result.isConfirmed) {

          //call delete
          let request:any = {};
          request.playerId = this.playerId!;
          request.etich = card.etich.name;
          request.cardId = card.id;
          this.playerStateService.delEtichetta(request).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Etichetta cancellata!','success');
              this.playerStateService.resetEtichette();
              this.takeEtichette();

              let cards = this.zaino!.filter(i => i.id === card.id);
              if(cards) {
                for(let card of cards) {
                  card.etich = undefined;
                }
              }
      
            } else {
              this.messageService.alert('Attenzione!','Errore durante la chiamata delEtichetta','error');
            }
          });
        }
      });
    }
  }

  assegnaEtichetta(etich:any) {
    let request:any = {}
    request.playerId = this.playerId;
    request.name = etich.name;
    request.card = this.cardEticSelected!;
    this.playerStateService.assegnaEtichetta(request).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Etichetta assegnata!','success');
        this.playerStateService.resetPlayerState();
        this.playerStateService.resetEtichette();
        this.takeEtichette();

        //find card for add color.
        let cards = this.zaino!.filter(i => i.id === this.cardEticSelected!);
        if(cards) {
          for(let card of cards) {
            let etichNew:any = {}
            etichNew.name = etich.name;
            etichNew.color = etich.color
            card.etich = etichNew;
          }
        }
        this.isDropdownVisible = false;

      } else {
        this.messageService.alert('Attenzione!','Errore durante la chiamata assegnaEtichetta','error');
      }
    });
  }

  retrieveCards(searchFilter: any) {
    this.searchFilter = searchFilter;
  }

  doFilter() {
    this.viewFilter=!this.viewFilter;
    this.isDropdownVisible = false;

    if(!this.viewFilter) {
      this.retrieveCards(undefined);
    }
  }

  doEtichetta() {
    this.viewEtichetta=!this.viewEtichetta;
    this.isDropdownVisible = false;
  }

  backSlice() {
    this.sliceEnd -= this.slice;
    this.sliceStart -= this.slice;
  }

  continueSlice() {
    this.sliceStart += this.slice;
    this.sliceEnd += this.slice;
  }

  createEtichetta() {
    let request:any = {};
    request.playerId = this.playerId;
    request.name = this.etichetta;
    request.color = this.color;

    this.playerStateService.addEtichetta(request).then((resp) => {
      if(resp === true) {
        this.messageService.alert('Fatto!','Etichetta aggiunta!','success');
        this.playerStateService.resetPlayerState();
        this.playerStateService.resetEtichette();
        this.takeEtichette();
      } else {
        if(resp && resp.status===401) {
          this.messageService.alert('Attenzione!','Hai già inserito questa etichetta, il nome non può essere duplicato','error');
        } else {
          this.messageService.alert('Attenzione!','Errore durante la chiamata addEtichetta','error');
        }
      }
    });
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // Aggiorna la posizione del menu durante lo scrolling
    if (this.isDropdownVisible) {
      this.isDropdownVisible = false; // Nascondi il menu durante lo scrolling
    }
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.playerStateService.getZaino().subscribe((value:Card[] | undefined) => {
          this.zaino = value;
        });
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
