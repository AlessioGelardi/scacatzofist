import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
providedIn: 'root'
})

export class HttpLogin {
    apiUrlLogin: string = environment.baseUrlLogin + "login";
    apiUrlSignin: string = environment.baseUrlLogin + "signin";

    constructor(private http: HttpClient) {}

    login(username:string,pss:string){
      return this.http.post<boolean>(this.apiUrlLogin, {username,pss});
    }

    signin(username:string,pss:string){
      return this.http.post<boolean>(this.apiUrlSignin, {username,pss});
    }
}
