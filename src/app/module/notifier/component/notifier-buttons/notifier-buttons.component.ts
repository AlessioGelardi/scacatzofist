import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from 'src/app/module/interface/button';

@Component({
  selector: 'notifier-buttons',
  templateUrl: './notifier-buttons.component.html',
  styleUrls: ['../../styles/notifier.css','./notifier-buttons.component.css']
})
export class NotifierButtonsComponent implements OnInit {

  @Input() buttons: Button[] = [];

  @Output() buttonOperation: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  action(code:string) {
    this.buttonOperation.emit(code);
  }

}
