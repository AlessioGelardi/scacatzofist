import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  inventory: Pack[] = [];

  packOpening: Card[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private marketStateService: StateMarketService,
    private playerStateService: StatePlayerService,
    private messageService: MessageService) {

  }

  ngOnInit(): void {

    this.playerId = this.route.snapshot.paramMap.get('id')!;

    this.takePlayer();
    this.takeInventory();
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
        this.packOpening = [];
        this.marketStateService.openPack(packId).then((resp) => {
          if(resp === true) {
            this.packOpening = resp;
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
  }

  sellPack(packId: string) {
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
          this.marketStateService.venditaPack(this.player!._id!,packId,result.value).then((resp) => {
            if(resp === true) {
              this.messageService.alert('Fatto!','Vendita creata con successo!','success');
              
              let cardDelete = this.inventory!.find(i => i.id === packId);
              if(cardDelete) {
                const index = this.inventory!.indexOf(cardDelete, 0);
                this.inventory!.splice(index,1);
              }
              this.playerStateService.resetInventory();
  
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
