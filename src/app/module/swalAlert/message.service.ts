import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card, SellPack } from 'src/app/module/interface/card';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private spinnerService: NgxSpinnerService) { }

  public alert(title: string, message: string, icon?: SweetAlertIcon) {
    this.spinnerService.hide();
    Swal.fire(title, message, icon).then((result) => { })
  }

  public showDetailCard(card:Card) {
    Swal.fire({
      title: card.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px">'+card.description+'</label>',
      imageUrl: 'https://images.ygoprodeck.com/images/cards/'+card.id+'.jpg',
      imageWidth: 160
    })
  }

  public showDetailPack(pack:SellPack) {
    Swal.fire({
      title: pack.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> PACK '+pack.name+' contenente '+pack.taglia+' carte!'+'</label>',
      imageUrl: pack.src,
      imageWidth: 160
    })
  }

}
