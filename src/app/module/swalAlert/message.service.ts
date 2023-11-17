import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Card, SellPack } from 'src/app/module/interface/card';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Attributi } from '../zaino/enum/attribute';
import { Razze } from '../zaino/enum/races';

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
    if(card.level>0) {
      Swal.fire({
        heightAuto: false,
        backdrop: false,
        title: card.name,
        color: '#3e3d3c',
        background: '#cdcccc',
        html: '<p>Livello: <strong>'+card.level+
        '</strong> Attributo: <strong>'+Attributi[card.attribute]+
        '</strong> Razza: <strong>'+Razze[card.race]+'</strong></p><p>'+
        card.desc+'</p><p>ATK: <strong>'+card.atk+'</strong> DEF: <strong>'+card.def+'</strong></p>',
        imageUrl: 'https://images.ygoprodeck.com/images/cards/'+card.id+'.jpg',
        imageWidth: 160
      })
    } else {
      Swal.fire({
        heightAuto: false,
        backdrop: false,
        title: card.name,
        color: '#3e3d3c',
        background: '#cdcccc',
        html: '<p>'+ card.desc+'</p>',
        imageUrl: 'https://images.ygoprodeck.com/images/cards/'+card.id+'.jpg',
        imageWidth: 160
      })
    }

  }

  public showDetailPack(pack:SellPack) {
    Swal.fire({
      heightAuto: false,
      backdrop: false,
      title: pack.name,
      color: '#3e3d3c',
      background: '#cdcccc',
      html: '<label style="font-size:14px"> PACK '+pack.name+' contenente '+pack.taglia+' carte!'+'</label>',
      imageUrl: pack.src,
      imageWidth: 160
    })
  }

}
