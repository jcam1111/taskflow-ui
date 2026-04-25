// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Api {
  
// }


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   private apiUrl = 'http://localhost:5000/api'; // Ajusta la URL de tu API

//   constructor(private http: HttpClient) { }

//   getUsers(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/users`);
//   }

//   getTasks(status?: string): Observable<any[]> {
//     let url = `${this.apiUrl}/tasks`;
//     if (status) {
//       url += `?status=${status}`;
//     }
//     return this.http.get<any[]>(url);
//   }

//   createTask(task: any): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/tasks`, task);
//   }

//   updateTaskStatus(id: number, status: string): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/tasks/${id}/status`, { status });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskStatus } from '../models/task-status';
import { User } from '../models/user.model';
import { CreateTaskDto } from '../dto/create-task.dto';
// import { TaskStatus } from '../models/task-status.model';

// DTO para el cuerpo de la solicitud de actualización
interface UpdateTaskStatusDto {
  newStatusId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Asegúrate de que esta URL coincida con la de tu backend
  // private apiUrl = 'http://localhost:5000/api';
  private apiUrl = 'https://localhost:7261/api';  

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de tareas, opcionalmente filtrada por ID de estado.
   * CORRECCIÓN: Acepta un 'number' para statusId.
   */
  getTasks(statusId?: number): Observable<Task[]> {
    let params = new HttpParams();
    if (statusId) {
      // El backend espera 'statusId' como parámetro de consulta
      params = params.set('statusId', statusId.toString());
    }
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { params });
  }

    /**
   * Obtiene la lista de todos los usuarios.
   * CORRECCIÓN: Método añadido que faltaba.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }


  /**
   * Crea una nueva tarea.
   * CORRECCIÓN: Método añadido que faltaba.
   */
  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  /**
   * Obtiene la lista de todos los posibles estados de tarea.
   * CORRECCIÓN: Método añadido que faltaba.
   */
  getTaskStatuses(): Observable<TaskStatus[]> {
    // Asumimos un endpoint /api/taskstatuses que devuelve los estados
    // Necesitarás crear este endpoint en tu backend.
    return this.http.get<TaskStatus[]>(`${this.apiUrl}/taskstatuses`);
  }

  /**
   * Actualiza el estado de una tarea específica.
   * CORRECCIÓN: Acepta 'number' para newStatusId y construye el DTO correcto.
   */
  updateTaskStatus(taskId: number, newStatusId: number): Observable<void> {
    const body: UpdateTaskStatusDto = { newStatusId };
    return this.http.put<void>(`${this.apiUrl}/tasks/${taskId}/status`, body);
  }
}