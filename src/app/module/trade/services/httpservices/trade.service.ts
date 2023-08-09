import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from 'src/app/module/interface/card';
import { Trade } from 'src/app/module/interface/trade';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  apiUrlTrade: string = environment.baseUrlTrade + "trade";
  apiUrlTradeById: string = environment.baseUrlTrade + "tradeById";

  apiUrlTradeFattibilita: string = environment.baseUrlTrade + "fattibilita";
  apiUrlTradeDeck: string = environment.baseUrlTrade + "tradeDeck";

  constructor(private http: HttpClient) { }

  newTrade(request:any) {
    return this.http.post<boolean>(this.apiUrlTrade,request,this.generateOptions());
  }

  getPrivateTrade(playerId: string): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.apiUrlTrade+'?id='+playerId);
  }

  getTrade(tradeId: string): Observable<Trade> {
    return this.http.get<Trade>(this.apiUrlTradeById+'?id='+tradeId);
  }

  updateTrade(request: any): Observable<boolean> {
    return this.http.put<boolean>(this.apiUrlTrade,request,this.generateOptions());
  }

  deleteTrade(tradeId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.apiUrlTrade+'?id='+tradeId);
  }

  fattibilitaTrade(deckId: string, playerId:string): Observable<Card[]> {
    return this.http.get<Card[]>(this.apiUrlTradeFattibilita+'?id='+deckId+'&playerId='+playerId);
  }

  offriScambio(request: any): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrlTradeDeck,request,this.generateOptions());
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
