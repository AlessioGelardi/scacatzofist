import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
providedIn: 'root'
})

export class HttpLogin {
    apiUrl: string = environment.baseUrlLogin + "login";

    constructor(private http: HttpClient) {}

    login(username:string,pss:string){
      return this.http.post<boolean>(this.apiUrl, {username,pss});
    }
}
