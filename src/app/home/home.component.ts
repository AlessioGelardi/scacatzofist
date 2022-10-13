import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Player } from '../interface/player';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  player:Player | undefined;

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.paramMap.get('id'))
  }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id')
    alert(playerId);
  }

}
