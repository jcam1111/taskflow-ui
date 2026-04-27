import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para una tarea creada (lo que enviamos a la API)
export interface CreateTask {
  title: string;
  userId: number;
  additionalInfo?: string;
}

// Interfaz para una tarea recibida (lo que la API nos devuelve)
// Coincide con el TaskDto del backend
export interface Task {
  id: number;
  title: string;
  userId: number;
  assignedUserName: string;
  statusId: number;
  statusName: string;
  createdAt: Date;
  additionalInfo?: string;
  priority?: string;
  tags?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Asegúrate de que el puerto coincida con tu API de .NET
  private apiUrl = 'https://localhost:7261/api/tasks';

  constructor(private http: HttpClient) { }

  /** Obtiene todas las tareas desde el backend */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /** Crea una nueva tarea */
  createTask(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }
}