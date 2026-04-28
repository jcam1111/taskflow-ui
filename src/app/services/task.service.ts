import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

// Interfaz para una tarea creada (lo que enviamos a la API)
export interface CreateTask {
  title: string;
  userId: number;
  additionalInfo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Asegúrate de que el puerto coincida con tu API de .NET
  private apiUrl = 'https://localhost:7261/api/tasks';

  constructor(private http: HttpClient) { }

  /** Obtiene todas las tareas desde el backend */
//   getTasks(): Observable<Task[]> {
//     return this.http.get<Task[]>(this.apiUrl);
//   }
// Modifica getTasks para aceptar un statusId opcional
  getTasks(statusId?: number): Observable<Task[]> {
    let params = new HttpParams();
    if (statusId !== undefined) {
      params = params.set('statusId', statusId.toString());
    }

    // Pasa los parámetros en la solicitud GET
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  /** Crea una nueva tarea */
  createTask(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }
}