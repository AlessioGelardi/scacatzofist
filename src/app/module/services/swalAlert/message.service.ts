import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Card } from '../../interface/card';

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
}
