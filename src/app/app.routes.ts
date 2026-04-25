import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list';
import { TaskFormComponent } from './task-form/task-form';

// export const routes: Routes = [];


// Se asume que has creado o vas a crear estos dos componentes.
// ng generate component task-list
// ng generate component task-form

export const routes: Routes = [
  {
    // Cuando el usuario visita la raíz del sitio (ej. http://localhost:4200),
    // será redirigido a la ruta '/tasks'.
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full' // Es importante para que solo coincida con la ruta vacía exacta.
  },
  {
    // Cuando la URL es '/tasks', se renderiza el componente que lista las tareas.
    path: 'tasks',
    component: TaskListComponent
  },
  {
    // Cuando la URL es '/tasks/new', se renderiza el formulario para crear una nueva tarea.
    path: 'tasks/new',
    component: TaskFormComponent
  },
  {
    // (Opcional pero recomendado) Una ruta comodín o "wildcard".
    // Si el usuario navega a cualquier URL que no coincida con las anteriores,
    // será redirigido a la lista de tareas.
    path: '**',
    redirectTo: '/tasks'
  }
];