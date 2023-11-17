import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card } from 'src/app/module/interface/card';
import { StateMarketService } from 'src/app/module/market/services/state/state-market.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { Player } from 'src/app/module/interface/player';

export interface Slice {
  card:Card;
  color: string;
  numTransform: number;
}

@Component({
  selector: 'app-horuseye',
  templateUrl: './horuseye.component.html',
  styleUrls: ['./horuseye.component.css']
})
export class HoruseyeComponent {

  buttons: Button[] = [];

  player:Player | undefined;

  slices: Slice[] = [];
  spinCost: number = 0;

  disableWheel:boolean = false;

  rotatioWheel: any = {};

  avanza:number=0;

  viewPick:boolean = false;
  selectCard:Card | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService,
    private marketStateService: StateMarketService) {

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
        class: "fa fa-arrow-left"
      }
    ];

    const playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(playerId);
    this.createWheel(playerId);
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.player?._id!}]);
          break;
        case 'BACK':
          window.history.back();
          break;
      }
    }
  }

  createWheel(playerId:string) {
    this.slices = [];

    let request: any = {}
    request.playerId = playerId;
    request.venerdi = this.playerStateService.getHorusEye();
    this.marketStateService.getHorusEye(request).then((resp) => {
      if(resp && resp.cards.length>0) {
        this.spinCost = resp.spinCost;
        const cardsEye = resp.cards;
        this.viewPick=false;
        for (let i = 0; i < cardsEye.length; i++) {
          const slice: Slice = {
            card: cardsEye[i],
            color: this.getRandomColor(),
            numTransform: i * (360 / 10)
          };
          this.slices.push(slice);
        }
    
        this.rotatioWheel = setInterval(() => {
          for (let i = 0; i < 10; i++) {
            this.slices[i].numTransform+=36;
            
          }
          this.avanza+=36;
    
        }, 1000);
      }
    });

    
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  orcaNumero(numRand:number) {
    let addCa = 0;
    const obj = [2,3,4,5,6,7,8,9,0,1];
    if(obj[numRand]!=0) {
      addCa = -(36*obj[numRand])
    }

    return addCa;
  }

  showCard(card:Card) {
    this.messageService.showDetailCard(card);
  }

  doRotation() {
    if(Number(this.player?.coin)>=this.spinCost) {
      if(!this.viewPick) {
        clearInterval(this.rotatioWheel);
        const numRand = Math.floor(Math.random()*10);
    
        for (let i = 0; i < 10; i++) {
          this.slices[i].numTransform+=720+this.orcaNumero(numRand)-this.avanza;
        }
    
        setTimeout(() => {
          this.viewPick=true;
          let indexCa = numRand+1;
          if(indexCa>=10) {
            indexCa = indexCa-10;
          }
          this.selectCard = this.slices[indexCa].card!;
  
          let request: any = {}
          request.cardId = this.selectCard.id;
          request.playerId = this.player?._id;
          request.type = this.selectCard.type;
          request.level = this.selectCard.level;
          this.marketStateService.postHorusEye(request).then((resp) => {
            if(resp == true) {
              this.marketStateService.resetHorusEye();
            } else {
              //TO-DO gestione degli errori
              /*
              if(resp.status===402) {
                this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
              }
              */
      
              this.messageService.alert('Attenzione!','Errore durante la chiamata postHorusEye','error');
            }
          });  
        }, 2000);
      } else {
        this.createWheel(this.player?._id!);
      }
    } else {
      this.messageService.alert('Attenzione!','Budget insufficente, i coin o i credits a disposizione non coprono la spesa','info');
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

}
