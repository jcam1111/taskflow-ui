import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { CreateTask, TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../models/task-status';
import { TaskStatusService } from '../services/task-status.service';
import { JsonParsePipe } from '../pipes/json-parse.pipe';

// Importamos nuestros servicios y modelos
// import { TaskService, Task, CreateTask } from '../../services/task.service';
// import { UserService, User } from '../../services/user.service';

// Validador personalizado para comprobar si un string es JSON válido
export function jsonValidator(control: AbstractControl): ValidationErrors | null {
  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  JsonParsePipe],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit {
  taskForm: FormGroup;
  tasks: Task[] = [];
  users: User[] = []; // Array para almacenar los usuarios del <select>
   statuses: TaskStatus[] = []; // <-- NUEVO: Array para almacenar los estados

// Opciones predefinidas para el desplegable de prioridad
  priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService, // Inyectamos el servicio de usuarios
    private taskStatusService: TaskStatusService,
    // 1. Inyecta ChangeDetectorRef en el constructor
    private cdr: ChangeDetectorRef
  ) {
    // Inicializamos el formulario reactivo
    this.taskForm = this.fb.group({
    //   title: ['', [Validators.required, Validators.maxLength(200)]],
    //   // Este es el control para el <select> de usuarios
    //   userId: [null, Validators.required], 
    //   additionalInfo: ['{\n  "Priority": "Medium",\n  "Tags": []\n}']
      // --- Controles Principales ---
      title: ['', [Validators.required, Validators.maxLength(200)]],
      userId: [null, Validators.required],

      // --- Grupo Anidado para la Información Adicional ---
      additionalInfo: this.fb.group({
        priority: ['Medium'], // Valor por defecto
        estimatedEndDate: [''],
        tags: this.fb.array([]), // Usamos FormArray para una lista dinámica de etiquetas
        freeMetadata: ['{}', jsonValidator] // Textarea con validación JSON
      }),
      
      // Control temporal solo para la UI de añadir etiquetas
      tagInput: ['']
    });
  }

    // Getter para acceder fácilmente al FormArray de etiquetas en el template
  get tags(): FormArray {
    return this.taskForm.get('additionalInfo.tags') as FormArray;
  }

  ngOnInit(): void {
    // Cuando el componente se carga, hacemos dos cosas:
    // 1. Cargar la lista de tareas existentes.
    // 2. Cargar la lista de usuarios para el formulario.
    this.loadTasks();
    this.loadUsers();
     this.loadStatuses(); // <-- LLAMAR A ESTE NUEVO MÉTODO
  }

   // --- Lógica para manejar etiquetas ---
  addTag(): void {
    const tagInput = this.taskForm.get('tagInput');
    if (tagInput?.value.trim()) {
      this.tags.push(this.fb.control(tagInput.value.trim()));
      tagInput.reset();
    }
  }

   removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  loadTasks(statusId?: number): void {
    this.taskService.getTasks(statusId).subscribe({
    //   next: (data) => this.tasks = data,
     next: (data) => {
        this.tasks = data;
        // 2. Llama a detectChanges() para notificar a Angular que la propiedad 'tasks' ha cambiado
        this.cdr.detectChanges();
        console.log('Tareas cargadas y vista actualizada.');
      },
      error: (err) => console.error('Error al cargar las tareas', err)
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
    //   next: (data) => this.users = data,
     next: (data) => {
        this.users = data;
        // 3. Llama a detectChanges() para actualizar la lista de usuarios en el <select>
        this.cdr.detectChanges();
        console.log('Usuarios cargados y vista actualizada.');
      },
      error: (err) => console.error('Error al cargar los usuarios', err)
    });
  }

  // --- NUEVO MÉTODO: Cargar los estados disponibles ---
  loadStatuses(): void {
    this.taskStatusService.getStatuses().subscribe({
      next: (data) => {
        this.statuses = data;
        this.cdr.detectChanges(); // Asegura que el selector se actualice
      },
      error: (err) => console.error('Error al cargar los estados', err)
    });
  }

  // --- NUEVO MÉTODO: Manejar el cambio en el filtro de estado ---
  onStatusFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStatusId = selectElement.value ? Number(selectElement.value) : undefined;
    
    this.loadTasks(selectedStatusId); // Recarga las tareas con el filtro aplicado
  }

//   onSubmit(): void {
//     if (this.taskForm.invalid) {
//       // Si el formulario no es válido, marcamos los campos para mostrar errores
//       this.taskForm.markAllAsTouched();
//       return;
//     }

//     // Creamos el objeto de la tarea a partir de los valores del formulario
//     const newTask: CreateTask = this.taskForm.value;

//     this.taskService.createTask(newTask).subscribe({
//       next: () => {
//         console.log('Tarea creada exitosamente');
//         this.loadTasks(); // Recargamos la lista de tareas para ver la nueva
//         this.taskForm.reset({
//            // Opcional: resetear con valores por defecto
//           additionalInfo: '{\n  "Priority": "Medium",\n  "Tags": []\n}'
//         });
//         // 4. (Opcional) Puedes llamar a detectChanges() aquí también si el reset no se refleja inmediatamente
//         this.cdr.detectChanges();
//       },
//       error: (err) => console.error('Error al crear la tarea', err)
//     });
//   }

// --- Lógica de Envío del Formulario (MODIFICADA) ---
  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // 1. Extraer los valores del grupo anidado
    const additionalInfoGroup = this.taskForm.get('additionalInfo')?.value;

    // 2. Construir el objeto JSON a partir de los controles del formulario
    const additionalInfoObject = {
      Priority: additionalInfoGroup.priority,
      EstimatedEndDate: additionalInfoGroup.estimatedEndDate || null, // Enviar null si está vacío
      Tags: additionalInfoGroup.tags, // El valor del FormArray ya es un array de strings
      FreeMetadata: JSON.parse(additionalInfoGroup.freeMetadata || '{}') // Parsear el string a un objeto
    };

    // 3. Convertir el objeto a un string JSON
    const additionalInfoString = JSON.stringify(additionalInfoObject, null, 2);

    // 4. Construir el DTO final para enviar a la API
    const finalTaskDto: CreateTaskDto = {
      title: this.taskForm.value.title,
      userId: this.taskForm.value.userId,
      additionalInfo: additionalInfoString
    };

    // 5. Enviar a la API
    this.taskService.createTask(finalTaskDto).subscribe({
      next: () => {
        console.log('Tarea creada exitosamente con JSON estructurado');
        this.loadTasks();
        
        // Resetear el formulario a su estado inicial
        this.tags.clear(); // Limpiar el FormArray de etiquetas
        this.taskForm.reset({
          title: '',
          userId: null,
          additionalInfo: {
            priority: 'Medium',
            estimatedEndDate: '',
            freeMetadata: '{}'
          },
          tagInput: ''
        });
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al crear la tarea', err)
    });
  }
}