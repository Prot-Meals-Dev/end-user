import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private BaseUrl = `${environment.apiUrl}/users`

  constructor(
    private http: HttpClient
  ) { }

  getUser(id: string) {
    return this.http.get(`${this.BaseUrl}/${id}`)
  }
}
