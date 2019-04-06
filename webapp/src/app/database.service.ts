import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

export interface Pipe {
  id: string
  material: string
  diameter: number
  length: number
  installationDate: number
  lastRepairDate: number
  predictedBreakDate: number
  repairCost: number
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private http: HttpClient) { }

  getPipes() {
    return this.http.get<Pipe[]>(`${environment.server}/list-pipes`)
  }
}
