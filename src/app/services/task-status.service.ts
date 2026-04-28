import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskStatus } from '../models/task-status';
// import { TaskStatus } from '../models/task-status.model';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  // Asegúrate de que esta URL sea la correcta para obtener los estados
  private apiUrl = 'https://localhost:7261/api/taskstatuses'; 

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<TaskStatus[]> {
    return this.http.get<TaskStatus[]>(this.apiUrl);
  }
}