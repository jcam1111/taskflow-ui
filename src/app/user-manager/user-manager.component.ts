import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  UserService } from '../services/user.service';
import { User } from '../models/user.model';
// import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-manager.component.html',
   styleUrls: ['./user-manager.component.css'] // <-- Asegúrate de que esta línea exista
})
export class UserManagerComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];

   // 1. AÑADIR PROPIEDAD PARA EL MENSAJE DE ÉXITO
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService,private cdr: ChangeDetectorRef) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]]

     // --- VALIDACIÓN DE CORREO ---
      // Se añade Validators.email al array de validadores.
      // Ahora, el control 'email' será inválido si está vacío O si no tiene formato de email.
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    // this.cdr.detectChanges();
  }

  loadUsers(): void {

     this.userService.getUsers().subscribe((data: User[]) => {
    
          // =======================================================
          // 1. MOSTRAR LOS ESTADOS (STATUSES) EN LA CONSOLA
          // =======================================================
          console.log('Users recibidos de la API:', data);
          this.users = data;
          // Obliga a Angular a repintar el HTML con los nuevos datos
          // ¡Asegúrate de inicializar tu arreglo visual aquí!
          this.users = [...this.users];
      this.cdr.detectChanges();
        });

    // this.userService.getUsers().subscribe(data => this.users = data);

    this.users = [...this.users];
    this.cdr.detectChanges();
  }

//   onSubmit(): void {
//     if (this.userForm.valid) {
//       this.userService.createUser(this.userForm.value).subscribe(() => {      
          

//         this.userForm.reset();
//         this.loadUsers();
//         // this.cdr.detectChanges();
//       });
//     } else {
//       // Marcar todos los campos como "tocados" para mostrar los mensajes de error
//       this.userForm.markAllAsTouched();
//     }
//   }
onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: (newUser) => {
          // 2. MOSTRAR EL MENSAJE DE CONFIRMACIÓN
          this.successMessage = `¡Usuario "${newUser.name}" creado exitosamente!`;
          
          this.userForm.reset();
          this.loadUsers();
          this.cdr.detectChanges();

          // 3. OCULTAR EL MENSAJE DESPUÉS DE 3 SEGUNDOS
          setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges(); // Asegurarse de que la vista se actualice
          }, 3000);
        },
        error: (err) => {
           // (Opcional) Manejar errores de la API aquí también
           console.error('Error al crear el usuario', err);
        }
      });
    }
  }
  
}