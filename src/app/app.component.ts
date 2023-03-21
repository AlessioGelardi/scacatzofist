import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent {

  isLogged = false;
  id:string | undefined;

  names: string[] = [];

  isGenerating: boolean = false;

  constructor() {

  }

  login(id: string) {
    if(id) {
      this.isLogged = true;
      this.id = id;
      
    }
  }

  turnHome() {
    //this.router.navigate(['/home',{id:this.id}]);
  }
  
}
