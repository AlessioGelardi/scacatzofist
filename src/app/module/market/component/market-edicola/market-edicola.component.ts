import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';
import { StateMarketService } from '../../services/state/state-market.service';
import { LoginService } from 'src/app/module/login/httpservices/login.service';

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
  numberCredits: number = 0;

  buyPackSrc: string | undefined;

  viewStarterDeck: boolean = false;

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

  setTypePack(typePack:number) {
    this.viewCurrencyExchange = false;
    this.viewPack = !this.viewPack;
    switch(typePack){
      case 1:
        this.packs = [{ 
          "name": "MOSTRO NORMALE Lv1-4",
          "baseCost": 2,
          "level": [1,2,3,4],
          "type": [17,4113],
          "src": "assets/pack/monster.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv1-4",
          "baseCost": 7,
          "level": [1,2,3,4],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monsterEffect.png",
          "monster": true
        }, {
          "name": "MOSTRO NORMALE Lv5-6",
          "baseCost": 5,
          "level": [5,6],
          "type": [17,4113],
          "src": "assets/pack/monster1.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv5-6",
          "baseCost": 12,
          "level": [5,6],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monster1Effect.png",
          "monster": true
        }, {
          "name": "MOSTRO NORMALE Lv7-9",
          "baseCost": 9,
          "level": [7,9],
          "type": [17,4113],
          "src": "assets/pack/monster2.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv7-9",
          "baseCost": 15,
          "level": [7,9],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monster2Effect.png",
          "monster": true
        }, {
          "name": "MOSTRO CON EFFETTO Lv10+",
          "baseCost": 17,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "src": "assets/pack/monster3.png",
          "monster": true
        }, {
          "name": "MOSTRO RITUALE",
          "baseCost": 17,
          "level": [0],
          "type": [129,161,673,2097313, 4257],
          "src": "assets/pack/monsterRitual.png",
          "monster": true
        },{
          "name": "MOSTRO FUSIONE",
          "baseCost": 20,
          "level": [0],
          "type": [97,65,4161,4193],
          "src": "assets/pack/monsterFusion.png",
          "monster": true
        }, {
          "name": "MOSTRO SYNCHRO",
          "baseCost": 22,
          "level": [0],
          "type": [8225,12321,8193],
          "src": "assets/pack/monsterSynchro.png",
          "monster": true
        }, {
          "name": "MOSTRO XYZ",
          "baseCost": 25,
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
          "type": [2],
          "level": [0],
          "monster": false
        }, {
          "name": "MAGIA RAPIDA",
          "baseCost": 6,
          "src": "assets/pack/magicFast.png",
          "type": [65538],
          "level": [0],
          "monster": false
        }, {
          "name": "MAGIA CONTINUA",
          "baseCost": 6,
          "src": "assets/pack/magicContinua.png",
          "type": [131074],
          "level": [0],
          "monster": false
        }, {
          "name": "MAGIA RITUALE",
          "baseCost": 2,
          "src": "assets/pack/magicRituale.png",
          "type": [130],
          "level": [0],
          "monster": false
        }, {
          "name": "MAGIA EQUIPAGGIAMENTO",
          "baseCost": 4,
          "src": "assets/pack/magicEquip.png",
          "type": 262146,
          "level": [0],
          "monster": false
        }, {
          "name": "MAGIA TERRENO",
          "baseCost": 5,
          "src": "assets/pack/magicTerreno.png",
          "type": [524290],
          "level": [0],
          "monster": false
        }]
        break;
      case 3:
        this.packs = [{ 
          "name": "TRAPPOLA NORMALE",
          "baseCost": 5,
          "src": "assets/pack/trap.png",
          "type": [4],
          "level": [0],
          "monster": false
        }, {
          "name": "TRAPPOLA CONTINUA",
          "baseCost": 6,
          "src": "assets/pack/trapContinua.png",
          "type": [131076],
          "level": [0],
          "monster": false
        }, {
          "name": "TRAPPOLA CONTRO",
          "baseCost": 6,
          "src": "assets/pack/trapContro.png",
          "type": [1048580],
          "level": [0],
          "monster": false
        }]
        break;
      case 4:
        this.packs = [{
          "name": "DAILY PACK",
          "baseCost": 35,
          "src": "assets/pack/dailyPack.png",
          "dailyPack": true
        }]
        break;
      case 5:
        this.packs = [{
          "id": "64289146c6b53689fe3b48c2",
          "name": "gogogo",
          "baseCost": 870,
          "src": "assets/deck/gogogo.png",
          "deck": true
        },{
          "id": "64289203c6b53689fe3b48c3",
          "name": "predapianta",
          "baseCost": 850,
          "src": "assets/deck/pianta.png",
          "deck": true
        },{
          "id": "64289315c6b53689fe3b48c4",
          "name": "amazoness",
          "baseCost": 550,
          "src": "assets/deck/amazoness.png",
          "deck": true
        },{
          "id": "642893fcc6b53689fe3b48c5",
          "name": "eroeElementale",
          "baseCost": 540,
          "src": "assets/deck/eroeElementale.png",
          "deck": true
        },{
          "id": "64289494c6b53689fe3b48c6",
          "name": "fata",
          "baseCost": 400,
          "src": "assets/deck/fata.png",
          "deck": true
        },{
          "id": "6428966dc6b53689fe3b48c8",
          "name": "ingranaggioAntico",
          "baseCost": 530,
          "src": "assets/deck/ingranaggioAntico.png",
          "deck": true
        },{
          "id": "642896ddc6b53689fe3b48c9",
          "name": "yugi",
          "baseCost": 320,
          "src": "assets/deck/yugi.png",
          "deck": true
        },{
          "id": "642897dbc6b53689fe3b48ca",
          "name": "zombie",
          "baseCost": 510,
          "src": "assets/deck/zombie.png",
          "deck": true
        },{
          "id": "64289844c6b53689fe3b48cb",
          "name": "drago",
          "baseCost": 370,
          "src": "assets/deck/drago.png",
          "deck": true
        },{
          "id": "642898cdc6b53689fe3b48cc",
          "name": "fuoco",
          "baseCost": 650,
          "src": "assets/deck/fuoco.png",
          "deck": true
        },{
          "id": "6428995dc6b53689fe3b48cd",
          "name": "luce",
          "baseCost": 590,
          "src": "assets/deck/luce.png",
          "deck": true
        },{
          "id": "64289a6bc6b53689fe3b48cf",
          "name": "palude",
          "baseCost": 300,
          "src": "assets/deck/palude.png",
          "deck": true
        },{
          "id": "64289ad4c6b53689fe3b48d0",
          "name": "reattore",
          "baseCost": 630,
          "src": "assets/deck/reattore.png",
          "deck": true
        },{
          "id": "64289b4fc6b53689fe3b48d1",
          "name": "samurai",
          "baseCost": 570,
          "src": "assets/deck/samurai.png",
          "deck": true
        },{
          "id": "64289bd0c6b53689fe3b48d2",
          "name": "gladiatore",
          "baseCost": 420,
          "src": "assets/deck/gladiatore.png",
          "deck": true
        },{
          "id": "64289cc5c6b53689fe3b48d4",
          "name": "monarca",
          "baseCost": 410,
          "src": "assets/deck/monarca.png",
          "deck": true
        },{
          "id": "64289d29c6b53689fe3b48d5",
          "name": "nordic",
          "baseCost": 490,
          "src": "assets/deck/nordic.png",
          "deck": true
        },{
          "id": "64289d9fc6b53689fe3b48d6",
          "name": "sfinge",
          "baseCost": 560,
          "src": "assets/deck/sfinge.png",
          "deck": true
        },{
          "id": "6428a07cc6b53689fe3b48d7",
          "name": "trappola",
          "baseCost": 310,
          "src": "assets/deck/trappola.png",
          "deck": true
        },{
          "id": "6428a0e9c6b53689fe3b48d8",
          "name": "warrior",
          "baseCost": 450,
          "src": "assets/deck/warrior.png",
          "deck": true
        },{
          "id": "6428a5e0c6b53689fe3b48d9",
          "name": "acqua",
          "baseCost": 360,
          "src": "assets/deck/acqua.png",
          "deck": true
        },{
          "id": "6428a639c6b53689fe3b48da",
          "name": "goblin",
          "baseCost": 310,
          "src": "assets/deck/goblin.png",
          "deck": true
        },{
          "id": "6428a68ec6b53689fe3b48db",
          "name": "insetto",
          "baseCost": 100,
          "src": "assets/deck/insetto.png",
          "deck": true
        },{
          "id": "6428a6f1c6b53689fe3b48dc",
          "name": "jinzo",
          "baseCost": 250,
          "src": "assets/deck/jinzo.png",
          "deck": true
        },{
          "id": "6428a74fc6b53689fe3b48dd",
          "name": "oscurita",
          "baseCost": 280,
          "src": "assets/deck/oscurita.png",
          "deck": true
        },{
          "id": "6428a79ec6b53689fe3b48de",
          "name": "vampiro",
          "baseCost": 410,
          "src": "assets/deck/vampiro.png",
          "deck": true
        },{
          "id": "6428a7e8c6b53689fe3b48df",
          "name": "vento",
          "baseCost": 240,
          "src": "assets/deck/vento.png",
          "deck": true
        },{
          "id": "64be98404d0276cf93cad775",
          "name": "alanera",
          "baseCost": 660,
          "src": "assets/deck/alanera.png",
          "deck": true
        },{
          "id": "64be97bb4d0276cf93cad765",
          "name": "occhiBlu",
          "baseCost": 590,
          "src": "assets/deck/occhiBlu.png",
          "deck": true
        },{
          "id": "64be974f4d0276cf93cad756",
          "name": "burn",
          "baseCost": 360,
          "src": "assets/deck/burn.png",
          "deck": true
        },{
          "id": "64be98614d0276cf93cad779",
          "name": "cyberDrago",
          "baseCost": 600,
          "src": "assets/deck/cyberDrago.png",
          "deck": true
        },{
          "id": "64be987f4d0276cf93cad77d",
          "name": "dragunita",
          "baseCost": 680,
          "src": "assets/deck/dragunita.png",
          "deck": true
        },{
          "id": "64be99034d0276cf93cad790",
          "name": "brancomalvagio",
          "baseCost": 880,
          "src": "assets/deck/brancomalvagio.png",
          "deck": true
        },{
          "id": "64be97724d0276cf93cad75d",
          "name": "rana",
          "baseCost": 330,
          "src": "assets/deck/rana.png",
          "deck": true
        },{
          "id": "64be972e4d0276cf93cad752",
          "name": "custodeTombe",
          "baseCost": 360,
          "src": "assets/deck/custodeTombe.png",
          "deck": true
        },{
          "id": "64be98a04d0276cf93cad783",
          "name": "reticulliano",
          "baseCost": 740,
          "src": "assets/deck/reticulliano.png",
          "deck": true
        },{
          "id": "64be97974d0276cf93cad761",
          "name": "horus",
          "baseCost": 310,
          "src": "assets/deck/horus.png",
          "deck": true
        },{
          "id": "64be99214d0276cf93cad794",
          "name": "matemech",
          "baseCost": 850,
          "src": "assets/deck/matemech.png",
          "deck": true
        },{
          "id": "64be95e04d0276cf93cad74a",
          "name": "mokeyMokey",
          "baseCost": 70,
          "src": "assets/deck/mokeyMokey.png",
          "deck": true
        },{
          "id": "64be98254d0276cf93cad771",
          "name": "nekroz",
          "baseCost": 710,
          "src": "assets/deck/nekroz.png",
          "deck": true
        },{
          "id": "64be96f84d0276cf93cad74e",
          "name": "oldSchool",
          "baseCost": 190,
          "src": "assets/deck/oldSchool.png",
          "deck": true
        },{
          "id": "64be98bb4d0276cf93cad787",
          "name": "rank5",
          "baseCost": 710,
          "src": "assets/deck/rank5.png",
          "deck": true
        },{
          "id": "64be99424d0276cf93cad799",
          "name": "ladroTempo",
          "baseCost": 870,
          "src": "assets/deck/ladroTempo.png",
          "deck": true
        },{
          "id": "64be98e14d0276cf93cad78b",
          "name": "acquaPower",
          "baseCost": 700,
          "src": "assets/deck/acquaPower.png",
          "deck": true
        },{
          "id": "64be97d94d0276cf93cad769",
          "name": "truccastella",
          "baseCost": 430,
          "src": "assets/deck/truccastella.png",
          "deck": true
        },{
          "id": "64be97fd4d0276cf93cad76d",
          "name": "stregartigiana",
          "baseCost": 550,
          "src": "assets/deck/stregartigiana.png",
          "deck": true
        },{
          "id": "64be99624d0276cf93cad79d",
          "name": "yosenju",
          "baseCost": 870,
          "src": "assets/deck/yosenju.png",
          "deck": true
        },{
          "id": "64be997b4d0276cf93cad7a2",
          "name": "zexal",
          "baseCost": 1000,
          "src": "assets/deck/zexal.png",
          "deck": true
        },{
          "id": "64be99994d0276cf93cad7a9",
          "name": "zoodiaco",
          "baseCost": 900,
          "src": "assets/deck/zoodiaco.png",
          "deck": true
        }]
        break;
      case 6:
        this.packs = [{
          "name": "GUERRIERO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 1,
          "src": "assets/pack/razza/guerriero.png",
          "monster": true
        },{
          "name": "INCANTATORE",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 2,
          "src": "assets/pack/razza/incantatore.png",
          "monster": true
        },{
          "name": "FATA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 4,
          "src": "assets/pack/razza/fata.png",
          "monster": true
        },{
          "name": "DEMONE",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 8,
          "src": "assets/pack/razza/demone.png",
          "monster": true
        },{
          "name": "ZOMBIE",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 16,
          "src": "assets/pack/razza/zombie.png",
          "monster": true
        },{
          "name": "MACCHINA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 32,
          "src": "assets/pack/razza/macchina.png",
          "monster": true
        },{
          "name": "ACQUA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 64,
          "src": "assets/pack/razza/acqua.png",
          "monster": true
        },{
          "name": "PYRO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 128,
          "src": "assets/pack/razza/pyro.png",
          "monster": true
        },{
          "name": "ROCCIA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 256,
          "src": "assets/pack/razza/roccia.png",
          "monster": true
        },{
          "name": "BESTIA_ALATA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 512,
          "src": "assets/pack/razza/bestia_alata.png",
          "monster": true
        },{
          "name": "PIANTA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 1024,
          "src": "assets/pack/razza/pianta.png",
          "monster": true
        },{
          "name": "INSETTO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 2048,
          "src": "assets/pack/razza/insetto.png",
          "monster": true
        },{
          "name": "TUONO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 4096,
          "src": "assets/pack/razza/tuono.png",
          "monster": true
        },{
          "name": "DRAGO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 8192,
          "src": "assets/pack/razza/drago.png",
          "monster": true
        },{
          "name": "BESTIA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 16384,
          "src": "assets/pack/razza/bestia.png",
          "monster": true
        },{
          "name": "GUERRIERO_BESTIA",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 32768,
          "src": "assets/pack/razza/guerriero_bestia.png",
          "monster": true
        },{
          "name": "DINOSAURO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 65536,
          "src": "assets/pack/razza/dinosauro.png",
          "monster": true
        },{
          "name": "SERPENTE_MARINO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 131072,
          "src": "assets/pack/razza/serpente_marino.png",
          "monster": true
        },{
          "name": "PESCE",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 262144,
          "src": "assets/pack/razza/pesce.png",
          "monster": true
        },{
          "name": "RETTILE",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 524288,
          "src": "assets/pack/razza/rettile.png",
          "monster": true
        },{
          "name": "PSICHICO",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 1048576,
          "src": "assets/pack/razza/psichico.png",
          "monster": true
        },{
          "name": "WYRM",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 8388608,
          "src": "assets/pack/razza/wyrm.png",
          "monster": true
        },{
          "name": "CYBERSE",
          "baseCost": 70,
          "level": [],
          "type": [],
          "race": 16777216,
          "src": "assets/pack/razza/cyberse.png",
          "monster": true
        }];
        break;
      case 7:
        this.packs = [{
          "name": "MOSTRO ACQUA Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,4113, 33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 2,
          "src": "assets/pack/attributi/lvl1-4_acqua.png",
          "monster": true
        },{
          "name": "MOSTRO ACQUA Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 2,
          "src": "assets/pack/attributi/lvl5-6_acqua.png",
          "monster": true
        },{
          "name": "MOSTRO ACQUA Lv7-9",
          "baseCost": 20,
          "level": [7,9],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 2,
          "src": "assets/pack/attributi/lvl7-9_acqua.png",
          "monster": true
        },{
          "name": "MOSTRO ACQUA Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 2,
          "src": "assets/pack/attributi/lvl10_acqua.png",
          "monster": true
        },{
          "name": "MOSTRI ACQUA EXTRA",
          "baseCost": 40,
          "level": [0],
          "type": [8225,12321,8193,97,65,4161,4193,8388641,8388609],
          "attribute": 2,
          "src": "assets/pack/attributi/extra_acqua.png",
          "monster": true
        }];
        break;
      case 8:
        this.packs = [{
          "name": "MOSTRO FUOCO Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,4113, 33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 4,
          "src": "assets/pack/attributi/lvl1-4_fuoco.png",
          "monster": true
        },{
          "name": "MOSTRO FUOCO Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 4,
          "src": "assets/pack/attributi/lvl5-6_fuoco.png",
          "monster": true
        },{
          "name": "MOSTRO FUOCO Lv7-9",
          "baseCost": 20,
          "level": [7,9],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 4,
          "src": "assets/pack/attributi/lvl7-9_fuoco.png",
          "monster": true
        },{
          "name": "MOSTRO FUOCO Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 4,
          "src": "assets/pack/attributi/lvl10_fuoco.png",
          "monster": true
        },{
          "name": "MOSTRI FUOCO EXTRA",
          "baseCost": 40,
          "level": [0],
          "type": [8225,12321,8193,97,65,4161,4193,8388641,8388609],
          "attribute": 4,
          "src": "assets/pack/attributi/extra_fuoco.png",
          "monster": true
        }];
        break;
      case 9:
        this.packs = [{
          "name": "MOSTRO LUCE Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,4113, 33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 16,
          "src": "assets/pack/attributi/lvl1-4_luce.png",
          "monster": true
        },{
          "name": "MOSTRO LUCE Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 16,
          "src": "assets/pack/attributi/lvl5-6_luce.png",
          "monster": true
        },{
          "name": "MOSTRO LUCE Lv7-9",
          "baseCost": 20,
          "level": [7,9],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 16,
          "src": "assets/pack/attributi/lvl7-9_luce.png",
          "monster": true
        },{
          "name": "MOSTRO LUCE Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 16,
          "src": "assets/pack/attributi/lvl10_luce.png",
          "monster": true
        },{
          "name": "MOSTRI LUCE EXTRA",
          "baseCost": 40,
          "level": [0],
          "type": [8225,12321,8193,97,65,4161,4193,8388641,8388609],
          "attribute": 16,
          "src": "assets/pack/attributi/extra_luce.png",
          "monster": true
        }];
        break;
      case 10:
        this.packs = [{
          "name": "MOSTRO OSCURITA Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,4113, 33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 32,
          "src": "assets/pack/attributi/lvl1-4_oscurita.png",
          "monster": true
        },{
          "name": "MOSTRO OSCURITA Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 32,
          "src": "assets/pack/attributi/lvl5-6_oscurita.png",
          "monster": true
        },{
          "name": "MOSTRO OSCURITA Lv7-9",
          "baseCost": 20,
          "level": [7,9],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 32,
          "src": "assets/pack/attributi/lvl7-9_oscurita.png",
          "monster": true
        },{
          "name": "MOSTRO OSCURITA Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 32,
          "src": "assets/pack/attributi/lvl10_oscurita.png",
          "monster": true
        },{
          "name": "MOSTRI OSCURITA EXTRA",
          "baseCost": 40,
          "level": [0],
          "type": [8225,12321,8193,97,65,4161,4193,8388641,8388609],
          "attribute": 32,
          "src": "assets/pack/attributi/extra_oscurita.png",
          "monster": true
        }];
        break;
      case 11:
        this.packs = [{
          "name": "MOSTRO TERRA Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,4113, 33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 1,
          "src": "assets/pack/attributi/lvl1-4_terra.png",
          "monster": true
        },{
          "name": "MOSTRO TERRA Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 1,
          "src": "assets/pack/attributi/lvl5-6_terra.png",
          "monster": true
        },{
          "name": "MOSTRO TERRA Lv7-9",
          "baseCost": 20,
          "level": [7,9],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 1,
          "src": "assets/pack/attributi/lvl7-9_terra.png",
          "monster": true
        },{
          "name": "MOSTRO TERRA Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 1,
          "src": "assets/pack/attributi/lvl10_terra.png",
          "monster": true
        },{
          "name": "MOSTRI TERRA EXTRA",
          "baseCost": 40,
          "level": [0],
          "type": [8225,12321,8193,97,65,4161,4193,8388641,8388609],
          "attribute": 1,
          "src": "assets/pack/attributi/extra_terra.png",
          "monster": true
        }];
        break;
      case 12:
        this.packs = [{
          "name": "MOSTRO VENTO Lv1-4",
          "baseCost": 10,
          "level": [1,2,3,4],
          "type": [17,4113, 33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 8,
          "src": "assets/pack/attributi/lvl1-4_vento.png",
          "monster": true
        },{
          "name": "MOSTRO VENTO Lv5-6",
          "baseCost": 15,
          "level": [5,6],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 8,
          "src": "assets/pack/attributi/lvl5-6_vento.png",
          "monster": true
        },{
          "name": "MOSTRO VENTO Lv7-9",
          "baseCost": 20,
          "level": [7,9],
          "type": [17,4113,33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 8,
          "src": "assets/pack/attributi/lvl7-9_vento.png",
          "monster": true
        },{
          "name": "MOSTRO VENTO Lv10+",
          "baseCost": 35,
          "level": [10],
          "type": [33,4129,33554977,545,1057,5153,4194337,37748769,2081,33554465,33558561,2097185,2101281],
          "attribute": 8,
          "src": "assets/pack/attributi/lvl10_vento.png",
          "monster": true
        },{
          "name": "MOSTRI VENTO EXTRA",
          "baseCost": 40,
          "level": [0],
          "type": [8225,12321,8193,97,65,4161,4193,8388641,8388609],
          "attribute": 8,
          "src": "assets/pack/attributi/extra_vento.png",
          "monster": true
        }];
        break;
    }
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
                  this.player!.credits = Number(this.player!.credits!) - 35;
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
  
            let prezzo = this.calculatePrezzo(taglia,baseCost,result.value);
  
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

  buyCredits() {
    if(this.numberCredits>0) {
      if(this.player!.coin!>=(this.numberCredits*1000)) {
        Swal.fire({
          title: 'Sei sicuro?',
          html: "Acquisterai <strong>"+this.numberCredits+" <i class='fa fa-diamond'></i></strong> al prezzo di <strong>"+this.numberCredits*1000+" <i class='fa fa-database'></i></strong>!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, acquista!',
          cancelButtonText: 'Non acquistare!'
        }).then((result) => {
          if (result.isConfirmed) {
  
            this.marketStateService.buyCredits(this.player!._id!,this.numberCredits).then((resp) => {
              if(resp) {
                this.player!.credits = Number(this.player!.credits!) + Number(this.numberCredits);
                this.player!.coin = this.player!.coin!-(this.numberCredits*1000);
                this.viewCurrencyExchange = false;
              } else {
                //TO-DO gestione degli errori
                /*
                if(resp.status===402) {
                  this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
                }
                */
        
                this.messageService.alert('Attenzione!','Problema durante l"acquisto dei crediti','error');
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
