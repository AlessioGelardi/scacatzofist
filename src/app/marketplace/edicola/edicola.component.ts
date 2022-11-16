import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { throws } from 'assert';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card, Pack, SellCard } from 'src/app/interface/card';
import { HttpPlayer } from 'src/app/services/httpPlayer';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'marketplace-edicola',
  templateUrl: './edicola.component.html',
  styleUrls: ['./edicola.component.css']
})
export class MarketPlaceEdicolaComponent implements OnInit {

  @Input() playerId:string | undefined;
  @Input() playerBudget: number | undefined;
  @Input() viewPack: boolean = false;
  @Input() finishPurchase: boolean = false;
  @Output() buttonTypePack: EventEmitter<boolean> = new EventEmitter();
  @Output() buttonFinishP: EventEmitter<boolean> = new EventEmitter();

  typePack:number = 0;
  packs: any[] = [];

  newPacks: Pack[] = []
  quantityPack: number[] = [];
  viewCards: Card[] = []

  constructor(private httpPlayerService: HttpPlayer, private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  setTypePack(typePack:number) {
    this.viewPack = !this.viewPack;
    this.buttonTypePack.emit(this.viewPack)
    this.typePack = typePack;
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

          if(this.playerBudget!-prezzo>=0) {
            this.spinnerService.show();
            this.viewCards = [];
            this.httpPlayerService.acquistaPacchetti(this.playerId!,level, typePack,taglia,result.value,prezzo,monster).subscribe({
              next: (result:Pack[]) => {
                this.swalAlert('Fatto!','Acquistato!','success');
                this.finishPurchase = true;
                this.buttonFinishP.emit(this.finishPurchase)
                this.newPacks = result;
              }, // completeHandler
              error: (error: any) => {
                this.spinnerService.hide();
                if(error.status===402) {
                  this.swalAlert('Attenzione!','Problema durante l"acquisto','error');
                }
              },
              complete: () => {
                this.spinnerService.hide();
              }
            });
          } else {
            this.swalAlert('Budget non sufficente!','Il prezzo del pack è '+prezzo,'error');
          }
        }
      })
    } else {
      this.swalAlert('Attenzione!','Scegliere il pack e la taglia','error');
    }
  }

  show(pack:Pack) {
    this.viewCards = pack.cards;
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

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

}
