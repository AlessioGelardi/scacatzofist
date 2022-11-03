import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Card, SellCard } from '../interface/card';
import { Player } from '../interface/player';
import { HttpPlayer } from '../services/httpPlayer';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  player:Player | undefined;

  marketPlace: SellCard[] = [];
  history: SellCard[] = [];

  viewCard: boolean = false;
  viewEdicola: boolean = false;
  viewPack:boolean=false;
  viewHistory:boolean=false;

  constructor(private route: ActivatedRoute,private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    //const playerId = this.route.snapshot.paramMap.get('id')
    this.spinnerService.show();
    this.httpPlayerService.getPlayer("63459b3a4b4c877f5a46f43e").subscribe({
      next: (result:Player) => {
        this.player = result;
      }, // completeHandler
      error: (error: any) => {
        this.spinnerService.hide();
        if(error.status===402) {
          this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
        }
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });

    this.getMarketPlace()
  }

  buttonOperationHandler(operation: any) {
    if(operation) {
        if(operation.backToHome) {
          this.router.navigate(['/home',{id:this.player?._id!}]);
        } else {
          this.viewCard = operation.viewCard;
          this.viewEdicola = operation.viewEdicola;
          this.viewPack = operation.viewPack;
          this.viewHistory = operation.viewHistory;
        }

        if(!this.viewCard && !this.viewEdicola) {
          this.getMarketPlace()
        }

        if(this.viewCard && this.viewHistory) {
          this.takeHistory(this.player?._id!);
        }
    }
  }

  sellCard(card:Card) {
    Swal.fire({
      title: 'Vendi la tua carta',
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
        this.httpPlayerService.venditaCard(this.player?._id!,card.id,result.value).subscribe(
          resultService => {
            this.spinnerService.hide();
            if(resultService) {
              this.swalAlert('Fatto!','Vendita creata con successo!','success');
            }
            else
              this.swalAlert('Errore','Qualcosa è andato storto durante la creazione della vendita','error');
          }
        );
      }
    })
  }

  deleteSellCard(idSellCard:string) {
    this.spinnerService.show()
    this.httpPlayerService.deleteSellCard(idSellCard).subscribe(
      resultService => {
        this.spinnerService.hide();
        if(resultService) {
          this.swalAlert('Fatto!','Vendita eliminata con successo!','success');
          this.takeHistory(this.player?._id!);
        }
        else
          this.swalAlert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
      }
    );
  }

  compraCard(sellCard:SellCard) {
    Swal.fire({
      title: sellCard.card.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> Sei sicur* di acquistare '+sellCard.card.name+' a '+sellCard.prezzo+' coin ?</label>',
      imageUrl: 'https://storage.googleapis.com/ygoprodeck.com/pics/'+sellCard.card.id+'.jpg',
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Acquista'
    }).then((result) => {
      if(result.isConfirmed) {
        this.httpPlayerService.acquistaCard(sellCard.id,this.player?._id!,sellCard).subscribe(
          resultService => {
            this.spinnerService.hide();
            if(resultService) {
              this.swalAlert('Fatto!','Acquistato!','success');
            }
            else
              this.swalAlert('Errore','Qualcosa è andato storto durante acquisto della carta','error');
          }
        );
      }
    })
  }

  setViewPack(viewPack: boolean) {
    this.viewPack = viewPack;
  }

  showCard(card:Card) {
    Swal.fire({
    title: card.name,
    color: '#3e3d3c',
    background: '#cdcccc',
    html: '<label style="font-size:14px">'+card.description+'</label>',
    imageUrl: 'https://storage.googleapis.com/ygoprodeck.com/pics/'+card.id+'.jpg',
    imageWidth: 160
    })
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

  private getMarketPlace() {
    this.spinnerService.show();
    this.httpPlayerService.getMarketplace().subscribe({
      next: (result:SellCard[]) => {
        this.marketPlace = result;
      }, // completeHandler
      error: (error: any) => {
        this.spinnerService.hide();
        if(error.status===402) {
          this.swalAlert('Attenzione!','Nessuna carta in vendita al momento','info');
        }
      },
      complete: () => {
        this.spinnerService.hide();
      }
    });
  }

  private async takeHistory(playerId: string) {
    this.spinnerService.show();
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
          this.httpPlayerService.getMarketPlaceById(playerId).subscribe({
            next: (result: SellCard[]) => {
              if (result) {
                this.history = result;
              }
            },
            error: (error: any) => {
              this.spinnerService.hide();
              if (error.status === 402) {
                this.swalAlert('Attenzione!', 'non ho trovato nulla con questo id, probabilmente è presente un problema con il market', 'error');
              }
            },
            complete: () => {
              this.spinnerService.hide();
            }
          });
          resolve()
      }, 10);
    });
  }

}
