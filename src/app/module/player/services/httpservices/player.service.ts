import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Card } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  apiUrlPlayer: string = environment.baseUrlPlayer + "player";
  apiUrlPlayers: string = environment.baseUrlPlayer + "players";
  apiUrlZaino: string = environment.baseUrlPlayer + "zainoById";

  constructor(private http: HttpClient) { }

  getPlayerById(id:string): Observable<Player>{
    return this.http.get<Player>(this.apiUrlPlayer+'?id='+id);
  }

  getAllPlayers(id:string): Observable<Player[]>{
    return this.http.get<Player[]>(this.apiUrlPlayers);
  }

  getZaino(id:string): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrlZaino+'?id='+id);
  }

}
