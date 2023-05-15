import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  apiUrlPlaynow: string = environment.baseUrlNotifier + "playnow";

  apiUrlNotify:string = environment.baseUrlNotifier + "notify";

  apiUrlDuelRec:string = environment.baseUrlNotifier + "duelrec";

  constructor(private http: HttpClient) { }

  newRequest(request:any):Observable<boolean> {
    request.dataIns = this.takeFormatToday();
    return this.http.post<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
  }

  updateRequest(request:any) {
    request.dataUpdate = this.takeFormatToday();
    return this.http.put<boolean>(this.apiUrlPlaynow,request,this.generateOptions());
  }

  getReqs(id:string, typeMod?:number):Observable<any> {
    let req:any = {};
    req.id = id;
    if(typeMod) {
        req.typeMod = typeMod!;
    }
    return this.http.get<any>(this.apiUrlPlaynow,{params:req});
  }
  
  getNumberNotify(id:string):Observable<number>{
    return this.http.get<number>(this.apiUrlNotify+'?id='+id);
  }

  createDuelRec(request:any):Observable<any> {
    request.dataIns = this.takeFormatToday();
    return this.http.post<boolean>(this.apiUrlDuelRec,request,this.generateOptions());
  }

  getDuelRec(id:string):Observable<any> {
    return this.http.get<any>(this.apiUrlDuelRec+'?id='+id);
  }

  private takeFormatToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return dd + '/' + mm + '/' + yyyy
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
