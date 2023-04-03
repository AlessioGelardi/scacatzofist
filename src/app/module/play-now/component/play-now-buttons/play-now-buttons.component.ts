import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'playnow-buttons',
  templateUrl: './play-now-buttons.component.html',
  styleUrls: ['./play-now-buttons.component.css']
})
export class PlayNowButtonsComponent implements OnInit {

  @Input() buttons: Button[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  action(code:string) {
    this.buttonOperation.emit(code);
  }

}
