import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private BaseUrl = `${environment.apiUrl}/weekly-menu`
  private RegionUrl = `${environment.apiUrl}/regions`
  private MealTypeUrl = `${environment.apiUrl}/meal-types`

  constructor(
    private http: HttpClient
  ) { }

  getMenu() {
    return this.http.get(`${this.BaseUrl}/customer/my-region`)
  }

  getRegions() {
    return this.http.get(`${this.RegionUrl}`)
  }

  getRegionMenu(id:string){
    return this.http.get(`${this.BaseUrl}/by-region/${id}`)
  }

  getMealTypes(){
    return this.http.get(`${this.MealTypeUrl}`)
  }
}
