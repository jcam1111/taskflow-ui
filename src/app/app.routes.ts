import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list';
import { TaskFormComponent } from './task-form/task-form';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { TaskManagerComponent } from './task-manager/task-manager.component';

// export const routes: Routes = [];


// Se asume que has creado o vas a crear estos dos componentes.
// ng generate component task-list
// ng generate component task-form

export const routes: Routes = [

   // --- RUTA PARA EL GESTOR DE USUARIOS ---
    // Cuando la URL sea 'http://localhost:4200/users', se cargará UserManagerComponent.
    {
        path: 'users',
        component: UserManagerComponent,
        title: 'Gestión de Usuarios' // Opcional: Establece el título de la página
    },
  {
    // Cuando el usuario visita la raíz del sitio (ej. http://localhost:4200),
    // será redirigido a la ruta '/tasks'.
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full' // Es importante para que solo coincida con la ruta vacía exacta.
  },
  {
    // Cuando la URL es '/tasks', se renderiza el componente que lista las tareas.
    path: 'tasks-list',
    component: TaskListComponent
  },
  // 2. Añade la nueva ruta para las tareas
    {
        path: 'tasks',
        component: TaskManagerComponent,
        title: 'Gestión de Tareas'
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