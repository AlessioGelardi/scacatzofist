import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Player } from '../interface/player';

@Injectable({
providedIn: 'root'
})

export class HttpLogin {
    apiUrlLogin: string = environment.baseUrlLogin + "login";
    apiUrlSignin: string = environment.baseUrlLogin + "signin";
    apiUrlRecupera: string = environment.baseUrlLogin + "recupera";

    constructor(private http: HttpClient) {}

    login(username:string,pss:string,ip:string){
      return this.http.post<Player>(this.apiUrlLogin, {username,pss,ip});
    }

    signin(player:any){
      return this.http.post<boolean>(this.apiUrlSignin, player);
    }

    recupera(usr:string, email:string) {
      let url = this.apiUrlRecupera+'?username='+usr;
      if(!usr && email){
        url = this.apiUrlRecupera+'?email='+email;
      } else if (usr && email) {
        url = this.apiUrlRecupera+'?username='+usr+'&email='+email;
      }

      return this.http.get<Player>(url);
    }
}
