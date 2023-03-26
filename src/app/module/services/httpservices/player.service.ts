import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from '../../interface/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  apiUrlPlayer: string = environment.baseUrlPlayer + "player";

  constructor(private http: HttpClient) { }

  getPlayerById(id:string): Observable<Player>{
    return this.http.get<Player>(this.apiUrlPlayer+'?id='+id);
  }

  getAllPlayers(){
    return this.http.get<Player[]>(this.apiUrlPlayer);
  }

}
