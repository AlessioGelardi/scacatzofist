import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'market-buttons',
  templateUrl: './market-buttons.component.html',
  styleUrls: ['./market-buttons.component.css']
})
export class MarketButtonsComponent implements OnInit {

  @Input() buttons: Button[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  action(code:string) {
    this.buttonOperation.emit(code);
  }

}
