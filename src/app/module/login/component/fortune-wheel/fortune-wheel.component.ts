import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LoginService } from '../../httpservices/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Deck } from 'src/app/module/interface/card';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { Player } from 'src/app/module/interface/player';

export interface Slice {
  label: string;
  color: string;
  numTransform: number;
}

@Component({
  selector: 'app-fortune-wheel',
  templateUrl: './fortune-wheel.component.html',
  styleUrls: ['./fortune-wheel.component.css']
})
export class FortuneWheelComponent implements OnInit {

  @Input() slices: Slice[] = [];

  arrow:number;

  viewStarter: boolean = false;
  nameDeck:string | undefined;

  decks:Deck[] = [];

  player:Player | undefined;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private loginService: LoginService,
    private spinnerService: NgxSpinnerService,
    private messageService: MessageService) {
    this.arrow=324;
  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(playerId);

    this.spinnerService.show();
    this.loginService.starterDeck().subscribe({
      next: (result) => {
        if(result) {
          this.decks=result;
          this.createWheel();
        }
      }, // completeHandler
      error: (error: any) => {
        this.spinnerService.hide();
        this.messageService.alert('Errore!','Errore durante il recupero degli starterDeck','error');
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });
    
  }

  createWheel() {
    this.slices = [];
    const deck:string[]=this.nameDecks();
    for (let i = 0; i < 10; i++) {
      const slice: Slice = {
        label: deck[i],
        color: this.getRandomColor(),
        numTransform: i * (360 / 10)
      };
      this.slices.push(slice);
    }
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  doRotation() {
    const numRand = Math.floor(Math.random()*10);

    for (let i = 0; i < 10; i++) {
      this.slices[i].numTransform+=1440+this.orcaNumero(numRand);
    }

    setTimeout(() => {
      this.viewStarter=true;
      this.nameDeck=this.slices[numRand+1].label.toUpperCase();
    }, 2000);
    
  }

  orcaNumero(numRand:number) {
    let addCa = 0;
    const obj = [2,3,4,5,6,7,8,9,0,1];
    if(obj[numRand]!=0) {
      addCa = -(36*obj[numRand])
    }

    return addCa;
  }

  login() {
    this.router.navigate(['/login']);
  }

  private nameDecks(): string[] {
    let namedecks:string[] = [];
    for (let x of this.decks) {
      namedecks.push(x['name'])
    }
    return namedecks;
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
