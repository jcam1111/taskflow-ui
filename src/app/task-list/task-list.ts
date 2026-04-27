// // import { Component } from '@angular/core';

// import { OnInit } from "@angular/core";
// import { ApiService } from "../services/api";

// // @Component({
// //   selector: 'app-task-list',
// //   imports: [],
// //   templateUrl: './task-list.html',
// //   styleUrl: './task-list.css',
// // })
// // export class TaskList {

// // }


// export class TaskListComponent implements OnInit {
//   tasks: any[] = [];
//   statuses: any[] = []; // Para almacenar los estados

//   constructor(private apiService: ApiService) {}

//   ngOnInit(): void {
//     this.loadTasks();
//     this.apiService.getTaskStatuses().subscribe(data => {
//       this.statuses = data;
//     });
//   }

//   loadTasks(statusId?: number): void {
//     this.apiService.getTasks(statusId).subscribe(data => {
//       this.tasks = data;
//     });
//   }

//   onFilterChange(event: Event): void {
//     const statusId = (event.target as HTMLSelectElement).value;
//     this.loadTasks(statusId ? Number(statusId) : undefined);
//   }

//   onStatusChange(taskId: number, event: Event): void {
//     const newStatusId = Number((event.target as HTMLSelectElement).value);
//     this.apiService.updateTaskStatus(taskId, newStatusId).subscribe(() => {
//       this.loadTasks(); // Recargar la lista
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
// import { ApiService } from '../services/api.service';
import { Task } from '../models/task.model';
import { ApiService } from '../services/api';
import { TaskStatus } from '../models/task-status';
// import { TaskStatus } from '../models/task-status.model';

import { ChangeDetectorRef } from '@angular/core';

// CORRECCIÓN: Decorador @Component activado y configurado como standalone
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule aquí
  templateUrl: './task-list.html',
   styleUrls: ['./task-list.css'] // Descomenta si tienes estilos
})
export class TaskListComponent implements OnInit {
  // CORRECCIÓN: Tipado fuerte para tasks y statuses
  tasks: Task[] = [];
  statuses: TaskStatus[] = [];

  // constructor(private apiService: ApiService) {}
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
    // CORRECCIÓN: El método ahora existe y 'data' está tipado
    this.apiService.getTaskStatuses().subscribe((data: TaskStatus[]) => {

      // =======================================================
      // 1. MOSTRAR LOS ESTADOS (STATUSES) EN LA CONSOLA
      // =======================================================
      console.log('Statuses recibidos de la API:', data);
      this.statuses = data;
      // Obliga a Angular a repintar el HTML con los nuevos datos
      // ¡Asegúrate de inicializar tu arreglo visual aquí!
      this.statuses = [...this.statuses];
  this.cdr.detectChanges();
    });
  }

  loadTasks(statusId?: number): void {
    // CORRECCIÓN: La llamada al servicio ahora es correcta
    this.apiService.getTasks(statusId).subscribe((data: Task[]) => {

       // =======================================================
      // 2. MOSTRAR LAS TAREAS (TASKS) EN LA CONSOLA
      // =======================================================
        console.log('Tasks recibidas de la API:', data);
      this.tasks = data;
this.cdr.detectChanges();
      
      // Obliga a Angular a repintar el HTML con los nuevos datos
  
    });
  }

  onFilterChange(event: Event): void {
    // El 'value' de un select siempre es un string, hay que convertirlo a número
    const selectedValue = (event.target as HTMLSelectElement).value;
    // Si el valor es una cadena vacía (opción "Todos"), pasa 'undefined'
    const statusId = selectedValue ? Number(selectedValue) : undefined;
    this.loadTasks(statusId);
    
  }

  onStatusChange(taskId: number, event: Event): void {
    const newStatusId = Number((event.target as HTMLSelectElement).value);
    // CORRECCIÓN: Los argumentos ahora coinciden con la firma del servicio
    this.apiService.updateTaskStatus(taskId, newStatusId).subscribe(() => {
      // Opcional: Para una mejor experiencia de usuario, solo actualiza la tarea cambiada
      // en lugar de recargar toda la lista. Pero recargar funciona bien.
      console.log(`Estado de la tarea ${taskId} actualizado. Recargando lista...`);
      this.loadTasks();
      // this.cdr.detectChanges();
    });
  }
}