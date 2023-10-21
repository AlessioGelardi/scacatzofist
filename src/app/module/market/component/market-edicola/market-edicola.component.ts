import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';
import { StateMarketService } from '../../services/state/state-market.service';

@Component({
  selector: 'app-market-edicola',
  templateUrl: './market-edicola.component.html',
  styleUrls: ['./market-edicola.component.css','../../styles/market.css']
})
export class MarketEdicolaComponent implements OnInit {

  player:Player | undefined;

  buttons: Button[] = [];

  packs: any[] = [];
  newPacks: Pack[] = [];
  viewCards: Card[] = [];
  
  zaino: Card[] = [];

  viewPack: boolean = false;
  finishPurchase: boolean = false;

  viewCurrencyExchange: boolean = false;
  numberCoins: number = 0;

  buyPackSrc: string | undefined;

  viewStarterDeck: boolean = false;

  selectedTypePack: number | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) { }

  ngOnInit(): void {

    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);

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
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-suitcase"
      },
    ];
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.player!._id!}]);
          break;
        case 'BACK':
          if(this.finishPurchase) {
            this.finishPurchase = !this.finishPurchase;
          } else {
            if(this.viewPack) {
              this.viewPack = !this.viewPack;
            } else {
              this.router.navigate(['/market',{id:this.player!._id!}]);
            }
          }

          break;
        case 'SELL':
          this.router.navigate(['/sell',{id:this.player!._id!}]);
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.player!._id!}]);
          break;
      }
    }
  }

  downChange() {
    if(this.numberCoins>=300) {
      this.numberCoins -=300;
    }
    
  }

  upChange() {
    this.numberCoins+=300;
  }

  setTypePack(typePack:number) {
    this.viewCurrencyExchange = false;
    this.numberCoins=0;
    this.viewPack = !this.viewPack;

    if(this.selectedTypePack !== typePack) {
      this.marketStateService.resetPacks();
    }

    this.marketStateService.getPacks(typePack).then((resp) => {
      if(resp) {
        this.packs=resp;
      } else {
        this.messageService.alert('Attenzione!','Errore durante la chiamata getPacks','error');
      }
    });
  }

  acquista(objectAcquista:any) {
    let name = objectAcquista.name;
    let taglia = objectAcquista.taglia;
    let baseCost = objectAcquista.baseCost;
    let typePack = objectAcquista.typePack;
    let level = objectAcquista.level;
    let race = objectAcquista.race;
    let monster = objectAcquista.monster;
    let attribute = objectAcquista.attribute;
    let dailyPack = objectAcquista.dailyPack;
    this.buyPackSrc = objectAcquista.src;
    const isDeck = objectAcquista.deck;
    const deckId = objectAcquista.deckId;

    if(dailyPack) {
      Swal.fire({
        title: 'Sei sicuro?',
        html: "Acquisterai il daily pack alla modica cifra di <strong> 35 <i class='fa fa-diamond'></i></strong>!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, acquista!',
        cancelButtonText: 'Non acquistare!'
      }).then((result) => {
        if (result.isConfirmed) {

          if(this.player!.credits!-35>=0) {

            let request:any = {};
            request.playerId = this.player!._id!;
            request.prezzo = 35;
            request.taglia = 12;
            request.level = 0;
            request.type = 0;
            request.quantity = 1;
            request.monster = false;
            request.src = this.buyPackSrc;
            request.name = name;
            request.isDaily = true;

            this.marketStateService.buyPack(request,false).then((resp) => {
              if(resp) {
                
                //TO-DO gestire errori
                if(!resp.status) {
                  this.player!.credits = Number(this.player!.credits!) - 35;
                  this.finishPurchase = true;
                  this.newPacks = resp;
                  this.viewCards = [];
                } else {
                  if(resp.status === 403) {
                    this.messageService.alert('Attenzione!','Hai già acquistato il daily pack oggi!!','error');
                  } else {
                    this.messageService.alert('Attenzione!','Problema durante l"acquisto del daily pack','error');
                  }
                }
              }
            });
          } else {
            this.messageService.alert('Budget non sufficente!','Il prezzo del pack è 35', 'error');
          }
        }
      })
    } else if(isDeck){
      Swal.fire({
        title: 'Sei sicuro?',
        html: "Acquisterai il deck alla modica cifra di <strong>"+ baseCost +"<i class='fa fa-diamond'></i></strong>!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, acquista!',
        cancelButtonText: 'Non acquistare!'
      }).then((result) => {
        if (result.isConfirmed) {

          if(this.player!.credits!-baseCost>=0) {

            let request:any = {};
            request.playerId = this.player!._id!;
            request.prezzo = baseCost;
            request.taglia = 1;
            request.level = 0;
            request.type = 0;
            request.quantity = 1;
            request.monster = false;
            request.src = this.buyPackSrc;
            request.name = name;
            request.isDaily = false;
            request.isDeck = true;
            request.deckId = deckId;

            this.marketStateService.buyPack(request,false).then((resp) => {
              if(resp) {
                
                //TO-DO gestire errori
                if(!resp.status) {
                  this.player!.credits = Number(this.player!.credits!) - baseCost;
                  this.finishPurchase = true;
                  this.newPacks = resp;
                  this.viewCards = [];
                } else {
                  this.messageService.alert('Attenzione!','Problema durante l"acquisto del deck','error');
                }
              }
            });
          } else {
            this.messageService.alert('Budget non sufficente!','Il prezzo del pack è '+baseCost, 'error');
          }
        }
      })
    } else {
      if(typePack !== 0 && taglia !== 0 && baseCost !== 0) {

        Swal.fire({
          title: 'Acquista il tuo pack',
          text: 'Scegli il numero di pack da acquistare',
          input: 'number',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Acquista'
        }).then((result) => {
          if (result.isConfirmed) {

            let prezzo = 999999999;
            if(race>0) {
              prezzo = baseCost;
            } else {
              prezzo = this.calculatePrezzo(taglia,baseCost,result.value);
            }
  
            if(this.player!.credits!-prezzo>=0) {

              let request:any = {};
              request.name = name;
              request.type = typePack;
              request.level = level;
              request.taglia = taglia;
              request.race = race;
              request.quantity = result.value;
              request.prezzo = prezzo;
              request.playerId = this.player!._id!;
              request.monster = monster;
              request.src = this.buyPackSrc;
              request.isDaily = false;
              request.attribute = attribute;
  
              this.marketStateService.buyPack(request,false).then((resp) => {
                if(resp) {
                  this.player!.credits = this.player!.credits!-prezzo;
                  this.finishPurchase = true;
                  this.newPacks = resp;
                  this.viewCards = [];
                } else {
                  //TO-DO gestione degli errori
                  /*
                  if(resp.status===402) {
                    this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
                  }
                  */
          
                  this.messageService.alert('Attenzione!','Problema durante l"acquisto del pacchetto','error');
                }
              });
            } else {
              this.messageService.alert('Budget non sufficente!','Il prezzo del pack è '+prezzo,'error');
            }
          }
        })
      } else {
        this.messageService.alert('Attenzione!','Scegliere il pack e la taglia','error');
      }
    }
    
  }

  show(pack:Pack) {
    this.viewCards = pack.cards;
  }

  viewExchange() {
    this.viewCurrencyExchange = true;
  }

  buyCoins() {
    if(this.numberCoins>0) {
      if(this.player!.credits!>=(this.numberCoins/300)) {
        Swal.fire({
          title: 'Sei sicuro?',
          html: "Acquisterai <strong>"+this.numberCoins+" <i class='fa fa-database'></i></strong> al prezzo di <strong>"+this.numberCoins/300+" <i class='fa fa-diamond'></i></strong>!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, acquista!',
          cancelButtonText: 'Non acquistare!'
        }).then((result) => {
          if (result.isConfirmed) {

            let request: any = {};
            request.playerId = this.player!._id!;
            request.coins = this.numberCoins;
  
            this.marketStateService.buyCoins(request).then((resp) => {
              if(resp == true) {
                
                this.player!.coin = Number(this.player!.coin!) + Number(this.numberCoins);
                this.player!.credits = this.player!.credits! - Number(this.numberCoins/300);
                this.viewCurrencyExchange = false;
                this.playerStateService.resetPlayerState();
                this.takePlayer(this.player?._id!);
              } else {
                //TO-DO gestione degli errori
                /*
                if(resp.status===402) {
                  this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
                }
                */
        
                this.messageService.alert('Attenzione!',"Problema durante l'acquisto dei coins",'error');
              }
            });
          }
        })
      } else {
        this.messageService.alert('Attenzione!','Budget insufficente, i coin a disposizione non coprono la spesa','info');
      }
      
    } else {
      this.messageService.alert('Attenzione!','I crediti da acquistare devono essere maggiori di 0','info');
    }
  }

  openPack(packId: string) {
    Swal.fire({
      title: 'Sei sicuro?',
      html: "Una volta aperto il pack non può essere più venduto, e verrà rimosso dall'inventario!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, apri!',
      cancelButtonText: 'Non aprire!'
    }).then((result) => {
      if (result.isConfirmed) {
        let request:any = {};
        request.playerId = this.player?._id!;
        request.packId = packId;
        this.marketStateService.openPack(request).then((resp) => {
          if(resp) {
            this.viewCards=resp;
            this.viewCurrencyExchange = false;
            this.deletePack(packId);

            window.scroll({ 
              top: 0, 
              left: 0, 
              behavior: 'smooth' 
            });
            this.playerStateService.resetZaino();
          } else {
            //TO-DO gestione degli errori
            /*
            if(resp.status===402) {
              this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
            }
            */
    
            this.messageService.alert('Attenzione!',"Problema durante l'apertura del pack",'error');
          }
        });
      }
    })
  }

  sellPack(pack: Pack) {
    Swal.fire({
      title: 'Vendi il tuo pack',
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
        if(result.value>0) {
          let request:any = {};
          request.playerId = this.player!._id!;
          request.packId = pack.id;
          request.prezzo = result.value;
          request.isPack = true;
          request.taglia = pack.taglia;
          request.src = pack.src;
          request.name = pack.name;
          request.type = pack.type;
          request.level = pack.level;
          request.monster = pack.monster;
          request.isDaily = pack.isDaily;
          request.isDeck = pack.isDeck;
          request.deckId = pack.deckId;
          this.marketStateService.venditaPack(request).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Vendita creata con successo!','success');
              this.deletePack(pack.id);
            } else {
              if(resp && resp.status !== 200) {
                this.messageService.alert('Errore','Qualcosa è andato storto durante la creazione della vendita del pack','error');
              }
            }
          });
        } else {
          this.messageService.alert('Attenzione','Il prezzo deve essere almeno maggiore di 0','info');
        }
        
      }
    })
  }

  private deletePack(packId: string) {
    let cardDelete = this.newPacks!.find(i => i.id === packId);
    if(cardDelete) {
      const index = this.newPacks!.indexOf(cardDelete, 0);
      this.newPacks!.splice(index,1);
    }
    this.playerStateService.resetInventory();
  }

  private takePlayer(playerId: string) {
    this.playerStateService.getPlayer(playerId).then((resp) => {
      if(resp) {
        this.player = resp;
        this.takeZaino(this.player?._id!);
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

  private calculatePrezzo(taglia:number, baseCost:number, quantity:number):number {
    let cost = taglia*baseCost;
    switch(taglia) {
      case 3:
        cost = cost*quantity;
        break;
      case 7:
        cost = (cost-baseCost)*quantity;
        break;
      case 12:
        cost = (cost-(baseCost*2))*quantity;
        break;
      case 15:
        cost = (cost-(baseCost*3))*quantity;
        break;
    }
    return cost;
  }

  private takeZaino(playerId:string) {
    this.playerStateService.getZaino(playerId).then((resp) => {
      if(resp) {
        this.zaino=resp
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
