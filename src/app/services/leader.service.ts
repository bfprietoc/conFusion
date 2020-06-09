import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';
import { of,Observable } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import  { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
      private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeader(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getFeaturedLeader(): Observable<Leader>{
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leadership => leadership[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

}
