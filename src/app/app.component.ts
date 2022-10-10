import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpLogin } from './services/httpLogin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myApp';

  constructor(private httpLoginService: HttpLogin) {
    
  }

  async ngOnInit(): Promise<void> {
    const access = await lastValueFrom(this.httpLoginService.login('Alessio','123ciao'));
    alert(access)
  }
}
