import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLogged = false;

  constructor(private router: Router) {

  }

  login(login: boolean) {
    if(login) {
      this.isLogged = true;
      this.router.navigateByUrl('/home');
    }
  }
}
