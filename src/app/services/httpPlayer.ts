import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Player } from '../interface/player';
import { Deck } from '../interface/card';

@Injectable({
providedIn: 'root'
})

export class HttpPlayer {
    apiUrlPlayer: string = environment.baseUrlLogin + "player";
    apiUrlCardById: string = environment.baseUrlLogin + "deckById";

    constructor(private http: HttpClient) {}

    getPlayer(id:string){
      return this.http.get<Player>(this.apiUrlPlayer+'?id='+id);
    }

    getDeckById(id:string) {
        return this.http.get<Deck>(this.apiUrlCardById+'?id='+id);
    }
}
