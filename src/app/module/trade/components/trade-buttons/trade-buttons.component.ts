import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'trade-buttons',
  templateUrl: './trade-buttons.component.html',
  styleUrls: ['../../styles/trade.css','./trade-buttons.component.css']
})
export class TradeButtonsComponent {
  
  @Input() buttons: Button[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  action(code:string) {
    this.buttonOperation.emit(code);
  }
}
