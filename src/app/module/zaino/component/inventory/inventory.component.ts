import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'src/app/module/interface/button';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';
import { StateMarketService } from 'src/app/module/market/services/state/state-market.service';
import { StatePlayerService } from 'src/app/module/player/services/state/state-player.service';
import { MessageService } from 'src/app/module/swalAlert/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  player:Player | undefined;

  playerId:string | undefined;

  buttons: Button[] = [];

  inventory: Pack[] = [];

  viewCards: Card[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {

    this.buttons = [
      {
        name: "HOME-BUTTON",
        code: "HOME",
        class: "fa fa-home"
      },
      {
        name: "CARD-BUTTON",
        code: "CARD",
        class: "fa fa-suitcase"
      },
      {
        name: "EDICOLA-BUTTON",
        code: "EDICOLA",
        class: "fa fa-diamond"
      },
    ];

    this.playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer();
    this.takeInventory();
  }
  
  action(code:string) {
    if(code) {
      switch(code) {
        case 'HOME':
          this.router.navigate(['/home',{id:this.player!._id!}]);
          break;
        case 'CARD':
          this.router.navigate(['/sell',{id:this.player!._id!}]);
          break;
        case 'EDICOLA':
          this.router.navigate(['/edicola',{id:this.player!._id!}]);
          break;
      }
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
        this.viewCards = [];
        let request:any = {};
        request.playerId = this.player?._id!;
        request.packId = packId;
        this.marketStateService.openPack(request).then((resp) => {
          if(resp) {
            this.viewCards = resp;
            this.deletePack(packId);
          } else {
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
    let cardDelete = this.inventory!.find(i => i.id === packId);
    if(cardDelete) {
      const index = this.inventory!.indexOf(cardDelete, 0);
      this.inventory!.splice(index,1);
    }
    this.playerStateService.resetInventory();
  }


  private takePlayer() {
    this.playerStateService.getPlayer(this.playerId!).then((resp) => {
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

  private takeInventory() {
    this.playerStateService.getInventory(this.playerId!).then((resp) => {
      if(resp) {
        this.inventory = resp;
      } else {
        //TO-DO gestione degli errori
        /*
        if(resp.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
        */

        this.messageService.alert('Attenzione!','Errore durante la chiamata getInventory','error');
      }
    });
  }
}
