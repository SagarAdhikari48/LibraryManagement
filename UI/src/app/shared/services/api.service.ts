import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = 'https://localhost:7233/api/library/';

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post(this.baseUrl + 'Register', user, {
      responseType: 'text',
    });
  }
}
