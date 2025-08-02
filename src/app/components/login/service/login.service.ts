import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private BaseUrl = `${environment.apiUrl}/auth/customer`
  private RegionUrl = `${environment.apiUrl}/regions`

  constructor(
    private http: HttpClient
  ) { }

  signUp(itm: any) {
    return this.http.post(`${this.BaseUrl}/register`, itm)
  }

  getRegions(){
    return this.http.get(`${this.RegionUrl}`)
  }
}
