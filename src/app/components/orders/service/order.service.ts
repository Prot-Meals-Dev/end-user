import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private BaseUrl = `${environment.apiUrl}/orders/customer/my-orders`

  constructor(
    private http: HttpClient
  ) { }

  getOrdersList(filters?: any) {
    let queryParams = [];

    if (filters?.limit) {
      queryParams.push(`limit=${filters.limit}`);
    }

    if (filters?.page) {
      queryParams.push(`page=${filters.page}`);
    }

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    return this.http.get(`${this.BaseUrl}${queryString}`);
  }
}
