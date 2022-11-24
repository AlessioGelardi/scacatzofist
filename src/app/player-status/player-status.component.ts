import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Player } from '../interface/player';

@Component({
  selector: 'app-player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.css']
})
export class PlayerStatusComponent implements OnInit {

  @Input() player:Player | undefined;
  @Input() numberNotify: number | undefined;
  @Input() typeMod:number | undefined;

  viewNotify:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  logout() {
    Swal.fire({
      title: 'Sicuro?',
      text: "Sei sicuro di voler fare il logout ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, esci!',
      cancelButtonText: 'No, rimani!'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    })
    
  }

  doNotify() {
    if(this.numberNotify!>0) {
      this.viewNotify = !this.viewNotify;
    }
  }

  closeNotify() {
    this.viewNotify=false;
  }

}
