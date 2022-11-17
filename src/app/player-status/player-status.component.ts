import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../interface/player';

@Component({
  selector: 'app-player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.css']
})
export class PlayerStatusComponent implements OnInit {

  @Input() player:Player | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  logout() {
    window.location.reload();
  }

}
