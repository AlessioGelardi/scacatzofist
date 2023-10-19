import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from 'src/app/module/interface/player';
import { environment } from 'src/environments/environment';
import { Deck } from '../../interface/card';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrlLogin: string = environment.baseUrlLogin + "login";
  apiUrlSignin: string = environment.baseUrlLogin + "signin";
  apiUrlRecupera: string = environment.baseUrlLogin + "recupera";
  apiUrlStarterDeck: string = environment.baseUrlLogin + "deck";

  constructor(private http: HttpClient) {}

  login(username:string,pss:string): Observable<Player>{
    return this.http.post<Player>(this.apiUrlLogin, {username,pss});
  }

  signin(player:any): Observable<boolean>{
    return this.http.post<boolean>(this.apiUrlSignin, player);
  }

  recupera(usr?:string | null, email?:string | null): Observable<Player> {
    let url = this.apiUrlRecupera+'?username='+usr;
    if(!usr && email){
      url = this.apiUrlRecupera+'?email='+email;
    } else if (usr && email) {
      url = this.apiUrlRecupera+'?username='+usr+'&email='+email;
    }

    return this.http.get<Player>(url);
  }

  starterDeck() {
    return this.http.get<Deck[]>(this.apiUrlStarterDeck);
  }

  getIPAddress() {  
    return this.http.get("http://api.ipify.org/?format=json");  
  }
}
