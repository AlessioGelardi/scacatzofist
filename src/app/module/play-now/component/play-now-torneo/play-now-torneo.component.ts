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
import { StateNotifierService } from 'src/app/module/notifier/services/state/state-notifier.service';

@Component({
  selector: 'app-play-now-torneo',
  templateUrl: './play-now-torneo.component.html',
  styleUrls: ['styles/torneo.css','./play-now-torneo.component.css']
})
export class PlayNowTorneoComponent {
  buttons: Button[] = [];

  player:Player | undefined;
  playerId: string | undefined;

  tournaments: Tournament[] = [];

  showDetail: boolean = false;
  selectTourn: Tournament | undefined;
  imOrg: boolean = false;

  showCreate: boolean = false;
  createTorneoForm = new FormGroup({
    name: new FormControl('Nuovo Torneo',[
      Validators.minLength(4)
    ]),
    access: new FormControl(1, Validators.required),
    orgPart: new FormControl(true, Validators.required),
    regCostCoins: new FormControl(0),
    regCostCredits: new FormControl(0),
    type: new FormControl(1, Validators.required),
    maxNReg: new FormControl(4, Validators.required)
  });

  types = Object.keys(TipologieTorneo).filter(key => isNaN(Number(key)));

  nPartecipanti = [4]
  accessTypes = Object.keys(AccessTypes).filter(key => isNaN(Number(key)));

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private notifierStateService: StateNotifierService,
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
    this.notifierStateService.resetTournaments();
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
    this.showCreate = true;
  }

  showTournaments(tourn: Tournament) {
    this.imOrg = tourn.orgName === this.player?.name;
    this.showDetail = true;
    this.selectTourn = tourn;
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
            this.takePlayer(this.playerId!);
          } else {
            if(this.showDetail) {
              this.refresh();
              this.showDetail = false;
            } else {
              this.router.navigate(['/playnow',{id:this.playerId}]);
            }
            
          }
          break;
        case 'REQUEST':
          this.router.navigate(['/request',{id:this.playerId,typeMode:TypeMod.TORNEO}]);
          break;
      }
    }
  }

  create() {
    if (this.createTorneoForm.valid) {
      const orgPart = this.createTorneoForm.value.orgPart;
      const regCostCoins = this.createTorneoForm.value.regCostCoins;
      const regCostCredits = this.createTorneoForm.value.regCostCredits;
      if(regCostCoins!==0 || regCostCredits!==0) {
        if(orgPart) {
          if(regCostCoins!==-1 && regCostCoins!>Number(this.player?.coin!)) {
            this.messageService.alert('Attenzione!','Il tuo Bugdet in coin non consente di partecipare, riduci il costo minimo se vuoi partecipare!','info');
            return;
          }
  
          if(regCostCredits!==-1 && regCostCredits!>Number(this.player?.credits!)) {
            this.messageService.alert('Attenzione!','Il tuo Bugdet in crediti non consente di partecipare, riduci il costo minimo se vuoi partecipare!','info');
            return;
          }
        }

        //creazione torneo
        let request: any = {};
        request.typeMod = TypeMod.TORNEO;
        request.playerIdReq = this.playerId;
        request.status = 1;
        request.nreg = 0;
        request.name = this.createTorneoForm.value.name;
        request.access = this.createTorneoForm.value.access;
        request.orgName = this.player?.name;
        request.orgPart = this.createTorneoForm.value.orgPart;
        request.regCostCoins = this.createTorneoForm.value.regCostCoins;
        request.regCostCredits = this.createTorneoForm.value.regCostCredits;
        request.type = Number(this.createTorneoForm.value.type);
        request.maxNReg = this.createTorneoForm.value.maxNReg;
        request.main = true;
        request.podio = {}
        request.posPlayer = {
          'firstRound': [],
          'secondRound': [],
          'loseRound': []
        };

        //calcolo per la vittoria (da spostare BE ?)
        request.vincita = {}

        //torneo classificato
        if(request.type===TipologieTorneo.CLASSIFICATO) {
          request.classificato = {}
        }

        //15% 35% 50%
        if(request.regCostCoins!>0) {
          const totCoins = request.regCostCoins * request.maxNReg;
          request.vincita["firstCoin"] = Math.round((totCoins * 50) / 100);
          request.vincita["secondCoin"] = Math.round((totCoins * 35) / 100);
          request.vincita["thirdCoin"] = Math.round((totCoins * 15) / 100);
        }

        if(this.createTorneoForm.value.regCostCoins!>0) {
          const totCredits = request.regCostCredits * request.maxNReg;
          request.vincita["firstCredits"] = Math.round((totCredits * 50) / 100);
          request.vincita["secondCredits"] = Math.round((totCredits * 35) / 100);
          request.vincita["thirdCredits"] = Math.round((totCredits * 15) / 100);
        }


        request.playersName = []
        request.playersId = []

        if(orgPart) {
          request.nreg = 1;
          request.playersName.push(this.player?.name)
          request.playersId.push(this.player?._id!)
        }

        this.notifierStateService.inviaRichiesta(request).then((resp) => {
          if(resp === true) {
            if(orgPart) {
              this.player!.coin = Number(this.player?.coin!)-regCostCoins!;
              this.player!.credits = Number(this.player?.credits!)-regCostCredits!;
              this.playerStateService.resetPlayerState();
              this.showCreate = false;
              this.refresh();
            }
            this.messageService.alert('Fatto!','Torneo creato!','success');
          } else {
            if(resp) {
              const statusError = resp.status;
              if(statusError === 402) {
                this.messageService.alert('Attenzione!','Hai già creato un torneo','error');
              } else {
                this.messageService.alert('Errore',"Errore durante la creazione del torneo",'error');
              }
            }
          }
        });
      } else {
        this.messageService.alert('Attenzione!','Inserire un costo di iscrizione','info');
      }
    } else {
      if(this.createTorneoForm.controls['name'].errors) {
        if (this.createTorneoForm.controls['name'].errors['minlength']) {
          this.messageService.alert('Attenzione!','Il nome minimo consentito è 4 lettere','info');
        }
      }
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

  private takeTournaments() {
    this.notifierStateService.getTournaments().then((resp) => {
      if(resp) {
        this.tournaments = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getTournaments','error');
      }
    });
  }
}
