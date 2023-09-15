import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Card, Pack } from 'src/app/module/interface/card';
import { Player } from 'src/app/module/interface/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  apiUrlPlayer: string = environment.baseUrlPlayer + "player";
  apiUrlPlayers: string = environment.baseUrlPlayer + "players";
  apiUrlZaino: string = environment.baseUrlPlayer + "zainoById";
  apiUrlInventory: string = environment.baseUrlPlayer + "inventoryById";
  apiUrlEtichetta: string = environment.baseUrlPlayer + "etichetta";

  constructor(private http: HttpClient) { }

  updatePlayer(request:any): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrlPlayer,request,this.generateOptions());
  }

  getPlayerById(id:string): Observable<Player>{
    return this.http.get<Player>(this.apiUrlPlayer+'?id='+id);
  }

  getAllPlayers(): Observable<Player[]>{
    return this.http.get<Player[]>(this.apiUrlPlayers);
  }

  getZaino(id:string): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrlZaino+'?id='+id);
  }

  getInventory(id:string): Observable<Pack[]> {
    return this.http.get<Pack[]>(this.apiUrlInventory+'?id='+id);
  }

  addEtichetta(request:any) {
    return this.http.post<boolean>(this.apiUrlEtichetta,request,this.generateOptions());
  }

  getEtichette(id:string) {
    return this.http.get<any[]>(this.apiUrlEtichetta+'?id='+id);
  }

  assegnaEtichette(request:any) {
    return this.http.put<boolean>(this.apiUrlEtichetta,request,this.generateOptions());
  }

  delEtichetta(request:any) {
    return this.http.delete<boolean>(this.apiUrlEtichetta+'?id='+request.playerId+'&etich='+request.etich+'&cardId='+request.cardId);
  }

  private generateOptions() {
    return {
      headers: new HttpHeaders({
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type':  'application/json'
      })
    };
  }

}
