import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockTransfer {
  id?: number;
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {

  private apiUrl = 'http://localhost:8080/api/stock-transfers';

  constructor(private http: HttpClient) {}

  getStockTransfers(): Observable<StockTransfer[]> {
    return this.http.get<StockTransfer[]>(this.apiUrl);
  }

  getStockTransfer(id: number): Observable<StockTransfer> {
    return this.http.get<StockTransfer>(
      `${this.apiUrl}/${id}`
    );
  }

  createStockTransfer(
    transfer: StockTransfer
  ): Observable<StockTransfer> {
    return this.http.post<StockTransfer>(
      this.apiUrl,
      transfer
    );
  }

  updateStockTransfer(
    id: number,
    transfer: StockTransfer
  ): Observable<StockTransfer> {
    return this.http.put<StockTransfer>(
      `${this.apiUrl}/${id}`,
      transfer
    );
  }

  deleteStockTransfer(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}