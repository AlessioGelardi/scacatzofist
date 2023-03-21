import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/interface/player';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrlLogin: string = environment.baseUrlLogin + "login";
  apiUrlSignin: string = environment.baseUrlLogin + "signin";
  apiUrlRecupera: string = environment.baseUrlLogin + "recupera";

  constructor(private http: HttpClient) {}

  login(username:string,pss:string): Observable<Player>{
    return this.http.post<Player>(this.apiUrlLogin, {username,pss});
  }

  signin(player:Player): Observable<boolean>{
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
}
