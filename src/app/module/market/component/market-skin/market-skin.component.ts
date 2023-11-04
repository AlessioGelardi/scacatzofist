import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Player } from 'src/app/module/interface/player';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import { StateMarketService } from '../../services/state/state-market.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-market-skin',
  templateUrl: './market-skin.component.html',
  styleUrls: ['./market-skin.component.css']
})
export class MarketSkinComponent {
  buttons: Button[] = [];

  player:Player | undefined;

  typeCase:number = 0;

  skinshop:any[] = [];
  selectedTexture:any | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {

    const playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer(playerId);
    this.takeSelectedTexture(playerId);

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
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      },
    ];
  }

  checkPurchase(name:string):boolean {
    let result = false;
    if(this.selectedTexture && this.selectedTexture.purchase && this.selectedTexture.purchase.length>0 && this.selectedTexture.purchase.includes(name)) {
      result= true
    }
    return result;
  }

  acquistaTexture(sh: any) {
    if(this.checkPurchase(sh.name)) {
      Swal.fire({
        title: 'Dove vuoi selezionare questa cover?',
        showDenyButton: this.typeCase!==3 && this.typeCase!==0 ? true : false,
        showCancelButton: true,
        confirmButtonText: this.typeCase===2 ? 'La mia cover' : this.typeCase === 1 ? 'Sfondo menu' : 'Attacco',
        denyButtonText: this.typeCase===2 ? 'Cover Avversario' : this.typeCase === 1 ? 'Sfondo duelli' : 'Attacco',
        cancelButtonText: 'Annulla',
      }).then((result) => {
        switch (this.typeCase) {
          case 1:
            if (result.isConfirmed) {

              this.selezionaTexture(3,sh.name);
              this.selectedTexture.selected.bg_menu = sh.name;
    
            } else if (result.isDenied) {
              this.selezionaTexture(4,sh.name);
              this.selectedTexture.selected.bg = sh.name;
    
            }
            break;
          case 2:
            if (result.isConfirmed) {

              this.selezionaTexture(1,sh.name);
              this.selectedTexture.selected.cover = sh.name;
    
            } else if (result.isDenied) {
              this.selezionaTexture(2,sh.name);
              this.selectedTexture.selected.cover2 = sh.name;
    
            }
            break;
          case 3:
            if (result.isConfirmed) {

              this.selezionaTexture(5,sh.name);
              this.selectedTexture.selected.attack = sh.name;
    
            }
            break;
          default:
            break;
        }
      })
    } else {
      if(this.player?.coin!>=sh.cost) {
        Swal.fire({
          title: 'Sei sicuro?',
          html: "Acquisterai la texture alla modica cifra di <strong>"+ sh.cost +" <i class='fa fa-database'></i></strong>!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, acquista!',
          cancelButtonText: 'Non acquistare!'
        }).then((result) => {
          if (result.isConfirmed) {

            let request:any = {}
            request.type = sh.case;
            request.cost = sh.cost;
            request.name = sh.name;
            request.playerId = this.player?._id!;
    
            this.marketStateService.acquistaTexture(request).then((resp) => {
              if(resp == true) {
                this.messageService.alert('Fatto!','Texture acquistata!','success');
                this.player!.coin! = this.player?.coin!-sh.cost;
                this.marketStateService.resetSelectedTexture();
                this.takeSelectedTexture(this.player?._id!);
              } else {
                //TO-DO gestione degli errori
                /*
                if(resp.status===402) {
                  this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
                }
                */
        
                this.messageService.alert('Attenzione!','Errore durante la chiamata acquistaTexture','error');
              }
            });
          }
        })
      } else {
        this.messageService.alert('Attenzione!','Non hai abbastanza coin per acquistare questa texture','info');
      }
    }
  }

  buttonOperationHandler(code: any) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.player!._id}]);
          break;
        case 'BACK':
          if(this.typeCase!==0) {
            this.typeCase=0;
          } else {
            window.history.back();
          }
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.player!._id}]);
          break;
      }
    }
  }

  showTexture(type:number) {
    this.typeCase=type;
    this.takeSkins(this.typeCase);
  }

  private selezionaTexture(type:number, name:string) {
    let request:any = {}
    request.type = type;
    request.name = name;
    request.playerId = this.player?._id;
    this.marketStateService.selezionaTexture(request).then((resp) => {
      if(resp == true) {
        this.messageService.alert('Fatto!','Texture selezionata!','success');
        this.marketStateService.resetSelectedTexture();
        this.takeSelectedTexture(this.player?._id!);
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata selezionaTexture','error');
      }
    });
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

  private takeSelectedTexture(playerId: string) {
    this.marketStateService.getSelectedTexture(playerId).then((resp) => {
      if(resp) {
        this.selectedTexture = resp;
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

  private takeSkins(type:number) {
    this.marketStateService.getSkins(type).then((resp) => {
      if(resp) {
        this.skinshop = resp;
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
