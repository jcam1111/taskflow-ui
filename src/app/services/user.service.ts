import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

// export interface User {
//   id?: number;
//   name: string;
//   email: string;
// }

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://localhost:7261/api/users'; // Ajusta a tu puerto real

  constructor(private http: HttpClient) {}

    /** Obtiene todos los usuarios para el menú desplegable */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}