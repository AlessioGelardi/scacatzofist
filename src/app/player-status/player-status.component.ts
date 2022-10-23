import { Component, Input, OnInit } from '@angular/core';
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

}
