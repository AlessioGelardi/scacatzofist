import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Card, SellCard } from '../interface/card';
import { Player } from '../interface/player';
import { HttpPlayer } from '../servicesOld/httpPlayer';
import { MarketplaceButtonComponent } from './button/button.component';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  player:Player | undefined;

  marketPlace: SellCard[] = [];
  history: SellCard[] = [];

  zaino: Card[] = [];
  sliceLimit: number | undefined;

  viewCard: boolean = false;
  viewEdicola: boolean = false;
  viewPack:boolean=false;
  viewHistory:boolean=false;
  finishPurchase:boolean=false;

  @ViewChild(MarketplaceButtonComponent) button:MarketplaceButtonComponent | undefined;

  constructor(private route: ActivatedRoute,private httpPlayerService: HttpPlayer,private spinnerService: NgxSpinnerService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    const playerId = this.route.snapshot.paramMap.get('id')!;

    await this.takePlayer(playerId);
    await this.takeZaino(playerId);
    await this.getMarketPlace();
  }

  async buttonOperationHandler(operation: any) {
    if(operation) {
        if(operation.backToHome) {
          this.router.navigate(['/home',{id:this.player?._id!}]);
        } else {
          if(operation.homeMarket) {
            this.viewCard = false;
            this.viewEdicola = false;
            this.viewPack = false;
            this.viewHistory = false;
            this.finishPurchase = false;
          } else {
            this.viewCard = operation.viewCard;
            this.viewEdicola = operation.viewEdicola;
            this.viewPack = operation.viewPack;
            this.viewHistory = operation.viewHistory;
            this.finishPurchase = operation.finishPurchase;
          }
        }

        if(!this.viewCard && !this.viewEdicola) {
          await this.getMarketPlace();
        }

        if(this.viewCard && this.viewHistory) {
          await this.takeHistory(this.player?._id!);
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
        this.spinnerService.show();
        this.httpPlayerService.venditaCard(this.player?._id!,card.id,result.value).subscribe({
          next: () => {
            this.button?.back()
            this.swalAlert('Fatto!','Vendita creata con successo!','success');
            this.takeZaino(this.player?._id!);
          }, // completeHandler
          error: (error: any) => {
            this.spinnerService.hide();
            if(error.status===403) {
              let msg = "";
              error.error.forEach((z: any) => msg=z.name+" x"+z.count);
              this.swalAlert('Attenzione!','Carta presente nel deck ---> '+msg,'error');
            }
          },
          complete: () => {
            this.spinnerService.hide();
          }
        });
      }
    })
  }

  async deleteSellCard(sellCard:any) {
    const idSellCard = sellCard.id;
    const cardId = sellCard.cardId;
    this.spinnerService.show()
    this.httpPlayerService.deleteSellCard(idSellCard, cardId, this.player?._id!).subscribe(
      async resultService => {
        this.spinnerService.hide();
        if(resultService) {
          this.swalAlert('Fatto!','Vendita eliminata con successo!','success');
          await this.takeHistory(this.player?._id!);
          await this.takeZaino(this.player?._id!);
        }
        else
          this.swalAlert('Errore','Qualcosa è andato storto durante la cancellazione della vendita','error');
      }
    );
  }

  async compraCard(sellCard:SellCard) {
    Swal.fire({
      title: sellCard.card.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> Sei sicur* di acquistare '+sellCard.card.name+' a <b>'+sellCard.prezzo+'</b> coin ?</label>',
      imageUrl: 'https://images.ygoprodeck.com/images/cards/'+sellCard.card.id+'.jpg',
      imageWidth: 160,
      showCancelButton: true,
      confirmButtonText: 'Acquista'
    }).then((result) => {
      if(result.isConfirmed) {
        this.httpPlayerService.acquistaCard(sellCard,this.player?._id!).subscribe(
          async resultService => {
            this.spinnerService.hide();
            if(resultService) {
              this.swalAlert('Fatto!','Acquistato!','success');
              await this.takePlayer(this.player?._id!);
              await this.takeZaino(this.player?._id!);
              await this.getMarketPlace();
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

  setFinishPurchase(finishPurchase:boolean) {
    this.finishPurchase = finishPurchase;
    this.takePlayer(this.player?._id!);
    this.takeZaino(this.player?._id!);
  }

  showCard(card:Card) {
    Swal.fire({
    title: card.name,
    color: '#3e3d3c',
    background: '#cdcccc',
    html: '<label style="font-size:14px">'+card.description+'</label>',
    imageUrl: 'https://images.ygoprodeck.com/images/cards/'+card.id+'.jpg',
    imageWidth: 160
    })
  }

  private swalAlert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

  private async getMarketPlace() {
    this.spinnerService.show();
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
          this.httpPlayerService.getMarketplace().subscribe({
            next: (result: SellCard[]) => {
              this.marketPlace = result;
            },
            error: (error: any) => {
              this.spinnerService.hide();
              if (error.status === 402) {
                this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
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

  private async takePlayer(playerId: string) {
    this.spinnerService.show();
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
          this.httpPlayerService.getPlayer(playerId).subscribe({
            next: (result: Player) => {
              if (result) {
                this.player = result;
              }
            },
            error: (error: any) => {
              this.spinnerService.hide();
              if (error.status === 402) {
                this.swalAlert('Attenzione!','non ho trovato nulla con questo id, probabilmente devi fare la registrazione','error');
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

  private async takeZaino(playerId: string) {
    this.spinnerService.show();
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
          this.httpPlayerService.getZainoById(playerId).subscribe({
            next: (result: Card[]) => {
              if (result) {
                this.zaino = result;
                this.sliceLimit = this.zaino.length;
              }
            },
            error: (error: any) => {
              this.spinnerService.hide();
              if (error.status === 402) {
                this.swalAlert('Attenzione!', 'non ho trovato nulla con questo id, probabilmente è presente un problema con lo zaino', 'error');
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
                this.history = [];
                this.swalAlert('Attenzione!','Nessuna carta in vendita al momento','info');
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
