import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLogged = true;

  constructor(private router: Router) {

  }

  login(id: string) {
    if(id) {
      this.isLogged = true;
      this.router.navigate(['/home',{id:id}]);
    }
  }
}
