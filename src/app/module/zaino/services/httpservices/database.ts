import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Card, Deck } from '../../../interface/card';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  apiUrlDatabase: string = environment.baseUrlDatabase + "cards";

  constructor(private http: HttpClient) { }

  getCards(request:any): Observable<Card[]> {
    return this.http.post<Card[]>(this.apiUrlDatabase,request,this.generateOptions());
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
