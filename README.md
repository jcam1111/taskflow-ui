# TaskflowUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.24.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


**Sistema de Gestión de Tareas (TaskFlow API)**

Este proyecto es una API RESTful construida con **.NET 8**, **Dapper** y **SQL Server** para gestionar tareas y usuarios. La API está diseñada para ser consumida por un frontend (por ejemplo, Angular) y demuestra una arquitectura por capas, el uso de procedimientos almacenados y el manejo avanzado de datos JSON nativo en SQL Server.

**Características**

* **Gestión de Usuarios**: Crear y listar usuarios.
* **Gestión de Tareas**: Crear, listar y actualizar el estado de las tareas.
* **Reglas de Negocio**: Se aplican reglas como la obligatoriedad del título y la prohibición de cambiar el estado de una tarea directamente de "Pendiente" a "Terminada".
* **Datos Flexibles**: Almacenamiento de metadatos adicionales (prioridad, etiquetas, etc.) en formato JSON, con validación y consultas eficientes a nivel de base de datos.
* **Arquitectura Limpia**: Separación de responsabilidades en Controladores y Repositorios.

**Pasos para Ejecutar el Proyecto**

**Prerrequisitos**

* [.NET 8 SDK](https://www.google.com/url?sa=E&q=https%3A%2F%2Fdotnet.microsoft.com%2Fdownload%2Fdotnet%2F8.0)
* [SQL Server 2016](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.microsoft.com%2Fes-es%2Fsql-server%2Fsql-server-downloads) o superior (Express, Developer o Standard).
* Una herramienta de gestión de base de datos como [SQL Server Management Studio (SSMS)](https://www.google.com/url?sa=E&q=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fsql%2Fssms%2Fdownload-sql-server-management-studio-ssms) o [Azure Data Studio](https://www.google.com/url?sa=E&q=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fsql%2Fazure-data-studio%2Fdownload-azure-data-studio).

**1. Configuración de la Base de Datos**

1. Abre tu herramienta de gestión de base de datos (SSMS o similar).
2. Copia el contenido completo del archivo Database\_Setup.sql proporcionado en el proyecto.
3. Ejecuta el script. Este script se encargará de:
   * Crear la base de datos TaskManagerDB.
   * Crear las tablas Users, TaskStatuses y Tasks.
   * Definir claves primarias, foráneas e índices.
   * **Añadir una restricción CHECK para validar que los datos en AdditionalInfo sean siempre JSON válido**.
   * Poblar las tablas con datos iniciales.
   * Crear todos los **procedimientos almacenados** necesarios para las operaciones de la API.

**2. Configuración del Backend (.NET API)**

1. Abre el proyecto de la API con tu editor preferido (Visual Studio, VS Code, Rider).
2. Localiza el archivo appsettings.json.
3. Modifica la cadena de conexión DefaultConnection para que apunte a tu instancia de SQL Server.

codeJSON

"ConnectionStrings": {

"DefaultConnection": "Server=TU\_SERVIDOR;Database=TaskManagerDB;User Id=TU\_USUARIO;Password=TU\_PASSWORD;TrustServerCertificate=True;"

}

**3. Ejecutar el Proyecto**

1. Abre una terminal en el directorio raíz del proyecto.
2. Ejecuta el siguiente comando para iniciar la API:

codeBash

dotnet run

1. Una vez iniciada, la API estará disponible en la URL especificada en la consola (generalmente https://localhost:7xxx y http://localhost:5xxx).
2. Puedes navegar a https://localhost:7xxx/swagger para acceder a la interfaz de Swagger, donde podrás ver y probar todos los endpoints disponibles.

**Decisiones Técnicas**

* **Arquitectura por Capas**: Se eligió una separación clara entre **Controladores** (responsables de la API web) y **Repositorios** (responsables del acceso a datos). Esto mejora la mantenibilidad y permite cambiar la capa de datos sin afectar la lógica de la API.
* **Acceso a Datos con Dapper**: En lugar de un ORM completo como Entity Framework, se optó por Dapper. Esta decisión se basó en:
  + **Rendimiento**: Dapper es significativamente más rápido al ser un "micro-ORM" que se enfoca en mapear resultados de consultas a objetos C#.
  + **Control Total sobre SQL**: Facilita el trabajo con una estrategia basada en procedimientos almacenados, ya que la lógica reside en la base de datos y no en la generación de consultas desde el código C#.
* **Lógica en Procedimientos Almacenados (SPs)**: Toda la lógica de negocio relacionada con los datos (creación, filtrado, actualización de estados) se encapsuló en procedimientos almacenados en SQL Server.
  + **Seguridad**: Previene ataques de inyección SQL.
  + **Centralización**: Las reglas de negocio (como no pasar de "Pending" a "Done") se definen en un único lugar, garantizando consistencia.
  + **Rendimiento**: Los SPs son pre-compilados por el motor de la base de datos, lo que optimiza su ejecución.
* **Manejo de Datos Flexibles con JSON Nativo**: Para almacenar metadatos variables sin la necesidad de añadir columnas constantemente, se utilizó una columna NVARCHAR(MAX) junto con las funcionalidades JSON nativas de SQL Server.
  + **Flexibilidad (Schema-on-read)**: Permite almacenar diferentes estructuras de datos para cada tarea, similar a una base de datos NoSQL.
  + **Integridad y Rendimiento**: A diferencia de simplemente guardar un string, se utiliza la restricción ISJSON para garantizar la validez de los datos. Funciones como JSON\_VALUE, JSON\_QUERY y OPENJSON permiten consultar y filtrar por estos datos de manera eficiente y directamente en el motor de la base de datos.

**Ejemplo de Consulta SQL con Funciones JSON**

Esta consulta demuestra cómo buscar tareas que cumplan múltiples criterios, incluyendo filtros dentro de la columna AdditionalInfo.

codeSQL

-- Objetivo: Encontrar todas las tareas asignadas a 'Juan Pérez' que

-- tengan una prioridad 'High' Y que incluyan la etiqueta 'Backend' en su array de etiquetas.

-- Declaramos variables para los filtros

DECLARE @UserName NVARCHAR(100) = 'Juan Pérez';

DECLARE @PriorityFilter NVARCHAR(50) = 'High';

DECLARE @TagFilter NVARCHAR(50) = 'Backend';

-- Ejecutamos la consulta

SELECT

t.Id,

t.Title,

ts.Name AS Status,

-- Uso de JSON\_VALUE: Extrae un valor escalar (string, número) del JSON.

-- Es ideal para usar en cláusulas SELECT y WHERE.

JSON\_VALUE(t.AdditionalInfo, '$.Priority') AS Priority,

-- Uso de JSON\_QUERY: Extrae un objeto o un array completo del JSON.

JSON\_QUERY(t.AdditionalInfo, '$.Tags') AS TagsAsJson

FROM

dbo.Tasks t

INNER JOIN

dbo.Users u ON t.UserId = u.Id

INNER JOIN

dbo.TaskStatuses ts ON t.StatusId = ts.Id

WHERE

u.Name = @UserName

AND JSON\_VALUE(t.AdditionalInfo, '$.Priority') = @PriorityFilter

-- Uso de OPENJSON: Convierte un array JSON en un conjunto de filas,

-- permitiendo buscar valores dentro del array de manera eficiente con EXISTS.

AND EXISTS (

SELECT 1

FROM OPENJSON(t.AdditionalInfo, '$.Tags')

WHERE value = @TagFilter

);

**Funcionalidades Pendientes**

* **Seguridad**: Implementar autenticación y autorización utilizando tokens (ej. JWT) para proteger los endpoints.
* **Frontend Completo**: Desarrollar la aplicación en Angular que consuma esta API, incluyendo formularios reactivos, enrutamiento y manejo de estado.
* **Paginación**: Añadir paginación a los endpoints GET que devuelven listas de recursos (tareas, usuarios) para manejar grandes volúmenes de datos.
* **Logging y Monitoreo**: Integrar un framework de logging como Serilog o NLog para registrar eventos importantes y errores.
* **Validación Avanzada**: Añadir una capa de servicio con FluentValidation para manejar reglas de negocio más complejas que no pertenecen ni al controlador ni al repositorio.
* **Pruebas**: Implementar pruebas unitarias para la lógica de negocio y pruebas de integración para los endpoints de la API.
* **Notificaciones**: Añadir un sistema de notificaciones (ej. por email) cuando se asigna una tarea o cambia de estado.
* Parametrizar desde la base de datos, en una tabla los cambios de estados permitidos
* Adicionar los campos de auditoria para las tablas como fecha modificación, fecha creación, usuario
* Adicionar campo usuario activo para consultar solo usuarios activos
* Permitir la relación de muchos a muchos entre las tablas task y usuarios para visualizar la trazabilidad de cada tarea, respecto a la asignación de cada usuario
