import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeader(): Promise<Leader[]> {
    return Promise.resolve(LEADERS);
  }
  getFeaturedLeader(): Promise<Leader>{
    return Promise.resolve(LEADERS.filter((leader)=>leader.featured)[0]);
  }

}
