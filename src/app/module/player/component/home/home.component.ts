import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from 'src/app/module/interface/player';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StatePlayerService } from '../../services/state/state-player.service';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface Message {
  name?: string,
  txt?: string
}

@Component({
  selector: 'player-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/player.css','./home.component.css']
})
export class HomeComponent implements OnInit {

  player:Player | undefined;
  numberNotify:number | undefined;

  bonus:boolean = false;

  users: any;
  chat: any[] = [];

  chatForm = new FormGroup({
    message: new FormControl('', Validators.required)
  });

  constructor(private route: ActivatedRoute,
    private playerStateService: StatePlayerService,
    private messageService: MessageService,
    private router: Router,
    private socket: Socket) {

  }

  getUsersCall() {
    return this.socket.fromEvent('current_users').pipe(map((data: any) => data))
  }

  getChatCall() {
    return this.socket.fromEvent('chat_messages').pipe(map((data: any) => data))
  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);
    this.takeNumberNotify(playerId);

    const oggi: Date = new Date();
    if(oggi.getDay() === 6 || oggi.getDay() === 0) {
      this.bonus = true;
    }

    this.getUsersCall().subscribe(users => {
      this.users = users;
    })

    this.getChatCall().subscribe(messages => {
      for(let item in messages) {
        this.chat.push(messages[item])
      }
    })
  }

  modificaDeck() {
    this.router.navigate(['/deck',{id:this.player?._id, permission: !(this.player?.ruolo! === 3)}]);
  }

  searchCard() {
    this.router.navigate(['/database',{id:this.player?._id}]);
  }

  marketPlace() {
    this.router.navigate(['/market',{id:this.player?._id}]);
  }

  giocaAdesso() {
    this.router.navigate(['/playnow',{id:this.player?._id, bonus:this.bonus}]);
  }

  trade() {
    this.messageService.alert('In progress...',"Questa funzionalità è ancora in sviluppo... Ci dispiace per l'inconveniente torna più tardi !!! ",'info');
    //this.router.navigate(['/trade',{id:this.player?._id}]);
  }

  pushMessage() {
    const message = this.chatForm.value.message!;
    this.socket.emit('message', {name:this.player?.name!,txt:message});
    this.chatForm.patchValue({
      message: ''
    });
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
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

  private takeNumberNotify(playerId: string) {
    /*
    this.spinnerService.show();
    this.httpPlayerService.getNumberNotify(playerId).subscribe({
      next: (result) => {
        if(result>0){
          this.numberNotify = result;
        }
      }, // completeHandler
      error: (error: any) => {
        this.spinnerService.hide();
        if(error.status===402) {
          this.messageService.alert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });*/
  }

}

