// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-task-form',
//   imports: [],
//   templateUrl: './task-form.html',
//   styleUrl: './task-form.css',
// })
// export class TaskForm {

// }


// import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// import { ApiService } from '../services/api';
// // import { ApiService } from '../../services/api.service';


// // CORRECCIÓN: Mover el validador fuera de la clase.
// // Es una función pura y no necesita el contexto 'this'.
// export function jsonValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     // Si el campo está vacío, es válido (el backend maneja los nulos).
//     if (!control.value) {
//       return null;
//     }
//     try {
//       JSON.parse(control.value);
//     } catch (e) {
//       // Si JSON.parse lanza un error, la validación falla.
//       return { jsonInvalid: true };
//     }
//     // Si no hay errores, la validación pasa.
//     return null;
//   };
// }

// @Component({
//   selector: 'app-task-form',
//   templateUrl: './task-form.component.html',
// })
// export class TaskFormComponent implements OnInit {
//   // taskForm: FormGroup;
//   taskForm!: FormGroup;
//   users: any[] = [];

//   constructor(private fb: FormBuilder, private apiService: ApiService) { }

//   ngOnInit(): void {
//     this.taskForm = this.fb.group({
//       title: ['', [Validators.required, Validators.maxLength(200)]],
//       userId: ['', Validators.required],
//       // additionalInfo: ['']
//       // additionalInfo: ['{}']
//        // Aplicar el validador personalizado
//  additionalInfo: ['{\n  "Priority": "Medium",\n  "Tags": []\n}', jsonValidator()]
//     // additionalInfo: ['{\n  "Priority": "Medium",\n  "Tags": []\n}', this.jsonValidator()]
//     });

//     this.apiService.getUsers().subscribe(data => {
//       this.users = data;
//     });
//   }

//   onSubmit(): void {
//     if (this.taskForm.valid) {
//       this.apiService.createTask(this.taskForm.value).subscribe(() => {
//         // Manejar respuesta
//          // Marcar todos los campos como "tocados" para mostrar los errores

//       this.taskForm.markAllAsTouched();
//       return;

//       });
//     }
//   }

//    // Validador personalizado
//   //  export function jsonValidator(): ValidatorFn {
// //   jsonValidator(): ValidatorFn {
// //   return (control: AbstractControl): ValidationErrors | null => {
// //     if (!control.value) {
// //       return null; // Permitir campo vacío
// //     }
// //     try {
// //       JSON.parse(control.value);
// //     } catch (e) {
// //       return { jsonInvalid: true }; // Si JSON.parse falla, el JSON es inválido
// //     }
// //     return null; // El JSON es válido
// //   };
// // }

// }



import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Para *ngFor y *ngIf
// import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { ApiService } from '../services/api';

// CORRECCIÓN: Mover el validador fuera de la clase.
// Es una función pura y no necesita el contexto 'this'.
export function jsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Si el campo está vacío, es válido (el backend maneja los nulos).
    if (!control.value) {
      return null;
    }
    try {
      JSON.parse(control.value);
    } catch (e) {
      // Si JSON.parse lanza un error, la validación falla.
      return { jsonInvalid: true };
    }
    // Si no hay errores, la validación pasa.
    return null;
  };
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  // CORRECCIÓN: Importar los módulos necesarios para el formulario
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.html',
   styleUrls: ['./task-form.css']
   
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  users: User[] = [];

  // Opcional: Para notificar al componente padre que se creó una tarea
  @Output() taskCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      // El valor inicial del select debe ser algo que no sea una opción válida, como null.
      userId: [null, Validators.required],
      // CORRECCIÓN: Llamada correcta al validador
      additionalInfo: ['{\n  "Priority": "Medium",\n  "Tags": []\n}', jsonValidator()]
    });

    // CORRECCIÓN: El método getUsers ahora existe y 'data' está tipado
    this.apiService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  onSubmit(): void {
    // Si el formulario es inválido, marca todos los campos como "tocados" para mostrar los errores y detiene.
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // CORRECCIÓN: La lógica aquí es enviar los datos, no solo marcar los campos.
    this.apiService.createTask(this.taskForm.value).subscribe({
      next: () => {
        console.log('Tarea creada exitosamente!');
        this.taskCreated.emit(); // Notificar al padre
        this.taskForm.reset({ // Reiniciar el formulario a sus valores iniciales
          title: '',
          userId: null,
          additionalInfo: '{\n  "Priority": "Medium",\n  "Tags": []\n}'
        });
      },
      error: (err) => {
        console.error('Error al crear la tarea:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }
}