import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private UserUrl = `${environment.apiUrl}/users`
  private OrderUrl = `${environment.apiUrl}/orders`
  private PaymentUrl = `${environment.apiUrl}/payments`;

  constructor(
    private http: HttpClient
  ) { }

  getUser(id: string) {
    return this.http.get(`${this.UserUrl}/${id}`)
  }

  newOrder(itm: any) {
    return this.http.post(`${this.OrderUrl}/customer`, itm)
  }

  verifyPayment(payload: any) {
    console.log(payload);
    
    return this.http.post(`${this.PaymentUrl}/razorpay/verify`, payload);
  }
}
