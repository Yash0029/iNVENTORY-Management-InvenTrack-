import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fulfillment {
  id?: number;
  orderId: number;
  status: string;
  assignedTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class FulfillmentService {

  private apiUrl = 'http://localhost:8080/api/fulfillments';

  constructor(private http: HttpClient) {}

  getFulfillments(): Observable<Fulfillment[]> {
    return this.http.get<Fulfillment[]>(this.apiUrl);
  }

  getFulfillment(id: number): Observable<Fulfillment> {
    return this.http.get<Fulfillment>(
      `${this.apiUrl}/${id}`
    );
  }

  createFulfillment(
    fulfillment: Fulfillment
  ): Observable<Fulfillment> {
    return this.http.post<Fulfillment>(
      this.apiUrl,
      fulfillment
    );
  }

  updateFulfillment(
    id: number,
    fulfillment: Fulfillment
  ): Observable<Fulfillment> {
    return this.http.put<Fulfillment>(
      `${this.apiUrl}/${id}`,
      fulfillment
    );
  }

  deleteFulfillment(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}