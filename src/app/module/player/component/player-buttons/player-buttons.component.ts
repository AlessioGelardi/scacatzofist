import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'player-buttons',
  templateUrl: './player-buttons.component.html',
  styleUrls: ['./player-buttons.component.css']
})
export class PlayerButtonsComponent {
  @Input() buttons: Button[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  action(code:string) {
    this.buttonOperation.emit(code);
  }
}
