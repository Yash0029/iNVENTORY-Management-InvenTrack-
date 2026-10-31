import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(
      `${this.apiUrl}/${id}`
    );
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(
      this.apiUrl,
      order
    );
  }

  updateOrder(
    id: number,
    order: Order
  ): Observable<Order> {
    return this.http.put<Order>(
      `${this.apiUrl}/${id}`,
      order
    );
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}