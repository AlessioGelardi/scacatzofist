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
  viewCards: Card[] = []

  viewPack: boolean = false;
  finishPurchase: boolean = false;

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
        name: "BACK-BUTTON",
        code: "BACK",
        class: "fa fa-undo"
      },
      {
        name: "SELL-BUTTON",
        code: "SELL",
        class: "fa fa-briefcase"
      },
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      }
    ];
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'BACK':
          this.router.navigate(['/market',{id:this.player!._id!}]);
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

  setTypePack(typePack:number) {
    this.viewPack = !this.viewPack;
    /*this.viewPack = !this.viewPack;
    this.buttonTypePack.emit(this.viewPack)
    this.typePack = typePack; */
    switch(typePack){
      case 1:
        this.packs = [{ 
          "name": "MOSTRO NORMALE Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,16401,20497,4113],
          "src": "assets/pack/monster.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv1-4",
          "baseCost": 15,
          "level": [1,2,3,4],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monsterEffect.png",
          "monster": true
        }, {
          "name": "MOSTRO NORMALE Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,16401,20497,4113],
          "src": "assets/pack/monster1.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv5-6",
          "baseCost": 20,
          "level": [5,6],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monster1Effect.png",
          "monster": true
        }, {
          "name": "MOSTRO NORMALE Lv7-9",
          "baseCost": 25,
          "level": [7,9],
          "type": [17,16401,20497,4113],
          "src": "assets/pack/monster2.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv7-9",
          "baseCost": 30,
          "level": [7,9],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monster2Effect.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monster3.png",
          "monster": true
        }, {
          "name": "MOSTRO RITUALE",
          "baseCost": 45,
          "level": [0],
          "type": [129,161,673,2097313, 4257],
          "src": "assets/pack/monsterRitual.png",
          "monster": true
        },{
          "name": "MOSTRO FUSIONE",
          "baseCost": 50,
          "level": [0],
          "type": [97,65,4161,4193],
          "src": "assets/pack/monsterFusion.png",
          "monster": true
        }, {
          "name": "MOSTRO SYNCHRO",
          "baseCost": 50,
          "level": [0],
          "type": [8225,12321,8193],
          "src": "assets/pack/monsterSynchro.png",
          "monster": true
        }, {
          "name": "MOSTRO XYZ",
          "baseCost": 55,
          "level": [0],
          "type": [8388641,8388609],
          "src": "assets/pack/monsterXYZ.png",
          "monster": true
        }]
        break;
      case 2:
        this.packs = [{ 
          "name": "MAGIA NORMALE",
          "baseCost": 5,
          "src": "assets/pack/magic.png",
          "type": 2,
          "monster": false
        }, {
          "name": "MAGIA RAPIDA",
          "baseCost": 15,
          "src": "assets/pack/magicFast.png",
          "type": 65538,
          "monster": false
        }, {
          "name": "MAGIA CONTINUA",
          "baseCost": 15,
          "src": "assets/pack/magicContinua.png",
          "type": 131074,
          "monster": false
        }, {
          "name": "MAGIA RITUALE",
          "baseCost": 10,
          "src": "assets/pack/magicRituale.png",
          "type": 130,
          "monster": false
        }, {
          "name": "MAGIA EQUIPAGGIAMENTO",
          "baseCost": 15,
          "src": "assets/pack/magicEquip.png",
          "type": 262146,
          "monster": false
        }, {
          "name": "MAGIA TERRENO",
          "baseCost": 10,
          "src": "assets/pack/magicTerreno.png",
          "type": 524290,
          "monster": false
        }]
        break;
      case 3:
        this.packs = [{ 
          "name": "TRAPPOLA NORMALE",
          "baseCost": 5,
          "src": "assets/pack/trap.png",
          "type": 4,
          "monster": false
        }, {
          "name": "TRAPPOLA CONTINUA",
          "baseCost": 15,
          "src": "assets/pack/trapContinua.png",
          "type": 131076,
          "monster": false
        }, {
          "name": "TRAPPOLA CONTRO",
          "baseCost": 15,
          "src": "assets/pack/trapContro.png",
          "type": 1048580,
          "monster": false
        }]
        break;
    }
  }

  acquista(objectAcquista:any) {
    let taglia = objectAcquista.taglia;
    let baseCost = objectAcquista.baseCost;
    let typePack = objectAcquista.typePack;
    let level = objectAcquista.level;
    let monster = objectAcquista.monster;
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

          let prezzo = this.calculatePrezzo(taglia,baseCost,result.value);

          if(this.player!.credits!-prezzo>=0) {

            this.marketStateService.buyPack(this.player!._id!,level, typePack,taglia,result.value,prezzo,monster).then((resp) => {
              if(resp) {
                this.player!.credits = this.player!.credits!-prezzo;
                this.finishPurchase = true;
                this.newPacks = resp;
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

  show(pack:Pack) {
    this.viewCards = pack.cards;
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

}
