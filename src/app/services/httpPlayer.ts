import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Player } from '../interface/player';

@Injectable({
providedIn: 'root'
})

export class HttpPlayer {
    apiUrlLogin: string = environment.baseUrlLogin + "player";

    constructor(private http: HttpClient) {}

    getPlayer(id:string){
      return this.http.get<Player>(this.apiUrlLogin+'?id='+id);
    }
}
