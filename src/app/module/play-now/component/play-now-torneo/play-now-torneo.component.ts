import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { TypeMod } from '../../enum/typeMod';
import { Tournament } from 'src/app/module/interface/tournament';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccessTypes, TipologieTorneo } from './enum/types';

@Component({
  selector: 'app-play-now-torneo',
  templateUrl: './play-now-torneo.component.html',
  styleUrls: ['./play-now-torneo.component.css']
})
export class PlayNowTorneoComponent {
  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  tournaments: Tournament[] = [];

  showCreate: boolean = true;
  createTorneoForm = new FormGroup({
    name: new FormControl('Nuovo Torneo',[
      Validators.minLength(4)
    ]),
    access: new FormControl(1),
    orgPart: new FormControl(true),
    regCostCoins: new FormControl(0),
    regCostCredits: new FormControl(0),
    type: new FormControl(1),
    maxNReg: new FormControl(4)
  });

  types = Object.keys(TipologieTorneo).filter(key => isNaN(Number(key)));

  nPartecipanti = [4]
  accessTypes = Object.keys(AccessTypes).filter(key => isNaN(Number(key)));

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private playerStateService: StatePlayerService) { }

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
      },
      {
        name: "REQUEST-BUTTON",
        code: "REQUEST",
        class: "fa fa-list"
      }
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;
    this.takePlayer(this.playerId);
    this.takeTournaments();
  }

  refresh() {
    this.takeTournaments();
  }

  convertString(key:any) {
    return key.toString();
  }

  public get TipologieTorneo() {
    return TipologieTorneo; 
  }

  public get AccessTypes() {
    return AccessTypes; 
  }

  addTournaments() {
    //TO-DO
    this.showCreate = true;
  }

  showTournaments(tourn: Tournament) {
    //TO-DO
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home']);
          break;
        case 'BACK':
          if(this.showCreate) {
            this.showCreate = false;
          } else {
            this.router.navigate(['/playnow',{id:this.playerId}]);
          }
          break;
        case 'REQUEST':
          this.router.navigate(['/request',{id:this.playerId,typeMode:TypeMod.TORNEO}]);
          break;
      }
    }
  }

  create() {
    //TO-DO
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

  private takeTournaments() {
    //TO-DO
  }
}
