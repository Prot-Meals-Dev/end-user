import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private BaseUrl = `${environment.apiUrl}/weekly-menu`

  constructor(
    private http:HttpClient
  ) { }

  getMenu(){
    return this.http.get(`${this.BaseUrl}/customer/my-region`)
  }
}
