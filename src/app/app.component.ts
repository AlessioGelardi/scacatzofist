import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLogged = false;
  id:string | undefined;

  constructor(private router: Router) {

  }

  login(id: string) {
    if(id) {
      this.isLogged = true;
      this.id = id;
      this.router.navigate(['/home',{id:id}]);
    }
  }

  turnHome() {
    this.router.navigate(['/home',{id:this.id}]);
  }
}
