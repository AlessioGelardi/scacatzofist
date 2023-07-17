import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  apiUrlTrade: string = environment.baseUrlTrade + "trade";

  constructor(private http: HttpClient) { }

  newTrade(request:any) {
    return this.http.post<boolean>(this.apiUrlTrade,request,this.generateOptions());
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
