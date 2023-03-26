import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'deck-buttons',
  templateUrl: './deck-buttons.component.html',
  styleUrls: ['../../styles/deck.css','./deck-buttons.component.css']
})
export class DeckButtonsComponent implements OnInit {

  @Input() buttons: Button[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  action(code:string) {
    this.buttonOperation.emit(code);
  }

}
