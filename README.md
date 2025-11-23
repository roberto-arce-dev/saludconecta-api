# SaludConecta API

## Descripción

Pacientes y médicos

API RESTful construida con NestJS, MongoDB y arquitectura DDD (Domain-Driven Design) que separa la autenticación (User) del dominio de negocio (Profiles).

## Tecnologías

- **Framework:** NestJS
- **Base de datos:** MongoDB con Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Rate Limiting:** @nestjs/throttler
- **Upload de archivos:** Multer + Sharp (thumbnails)

## Arquitectura

### Patrón DDD (Domain-Driven Design)

**Separación de dominios:**
- **Dominio de Autenticación:** `User` (email, password, role)
- **Dominio de Negocio:** `Profiles` (datos específicos de cada rol)

**Factory Pattern:** El servicio de autenticación crea automáticamente el Profile correspondiente según el rol del usuario durante el registro.

### Roles del Sistema

- **PACIENTE**
- **MEDICO**
- **ADMIN**

### Profiles

- **PacienteProfile** (rol: PACIENTE)
- **MedicoProfile** (rol: MEDICO)

### Entidades de Negocio

- CitaMedica
- HistorialClinico
- Tratamiento

---

## Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- MongoDB 4.4+

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd saludconecta-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/saludconecta_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Puerto
PORT=3016

# Node Environment
NODE_ENV=development
```

Para producción, crear `.env.production`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/saludconecta_db
JWT_SECRET=otro_secreto_diferente_para_produccion
JWT_EXPIRES_IN=7d
PORT=3016
NODE_ENV=production
```

4. **Compilar el proyecto**
```bash
npm run build
```

---

## Ejecución

### Modo Desarrollo
```bash
npm run start:dev
```

### Modo Producción
```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3016`

---

## Documentación API (Swagger)

Una vez iniciado el servidor, accede a la documentación interactiva:

**URL:** `http://localhost:3016/api`

Swagger proporciona:
- Lista completa de endpoints
- Modelos de datos
- Posibilidad de probar endpoints directamente
- Ejemplos de requests y responses

---

## Endpoints Principales

### Autenticación

#### Registrar Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "role": "PACIENTE",
  "nombre": "Juan Pérez",
  "telefono": "+51 987654321"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "PACIENTE",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Roles disponibles para registro:**
- `PACIENTE`
- `MEDICO`

#### Iniciar Sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "PACIENTE"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Obtener Información del Usuario Autenticado
```bash
GET /api/auth/profile
Authorization: Bearer {access_token}
```

```bash
Authorization: Bearer {access_token}
```

---

## Profiles

### PacienteProfile

**Rol asociado:** `PACIENTE`

**Endpoints disponibles:**

#### Obtener mi perfil
```bash
GET /api/paciente-profile/me
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",

  "nombre": "Valor de ejemplo",
  "telefono": "Valor de ejemplo",
  "fechaNacimiento": "Valor de ejemplo"
,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar mi perfil
```bash
PUT /api/paciente-profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Valor de ejemplo",
  "telefono": "Valor de ejemplo",
  "fechaNacimiento": "Valor de ejemplo"
}
```

#### Listar todos los perfiles (Admin)
```bash
GET /api/paciente-profile
Authorization: Bearer {token_admin}
```

#### Obtener perfil por userId (Admin)
```bash
GET /api/paciente-profile/{userId}
Authorization: Bearer {token_admin}
```


### MedicoProfile

**Rol asociado:** `MEDICO`

**Endpoints disponibles:**

#### Obtener mi perfil
```bash
GET /api/medico-profile/me
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",

  "nombreCompleto": "Valor de ejemplo",
  "telefono": "Valor de ejemplo",
  "especialidad": "Valor de ejemplo"
,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar mi perfil
```bash
PUT /api/medico-profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombreCompleto": "Valor de ejemplo",
  "telefono": "Valor de ejemplo",
  "especialidad": "Valor de ejemplo"
}
```

#### Listar todos los perfiles (Admin)
```bash
GET /api/medico-profile
Authorization: Bearer {token_admin}
```

#### Obtener perfil por userId (Admin)
```bash
GET /api/medico-profile/{userId}
Authorization: Bearer {token_admin}
```


---

## Upload de Imágenes

### Upload General
```bash
POST /api/upload/image
Content-Type: multipart/form-data

file: [archivo de imagen]
```

**Respuesta:**
```json
{
  "message": "Imagen subida exitosamente",
  "imagen": "uploads/1700000000000-imagen.jpg",
  "imagenThumbnail": "uploads/thumbnails/thumb-1700000000000-imagen.jpg"
}
```

### Servir Imágenes

**Imagen original:**
```
GET http://localhost:3016/uploads/1700000000000-imagen.jpg
```

**Thumbnail:**
```
GET http://localhost:3016/uploads/thumbnails/thumb-1700000000000-imagen.jpg
```

---

## Rate Limiting

El API implementa rate limiting para proteger contra abuso:

- **short:** 3 requests por segundo
- **medium:** 20 requests por 10 segundos
- **long:** 100 requests por minuto

Si excedes el límite, recibirás un error `429 Too Many Requests`.

---

## Autenticación JWT

### Obtener Token

Después de login o registro, recibirás un `access_token`. Úsalo en las peticiones que requieren autenticación:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Endpoints Protegidos

Todos los endpoints excepto `/auth/register` y `/auth/login` requieren autenticación.

### Roles y Permisos

- **Usuario autenticado:** Puede acceder a sus propios datos (endpoints `/me`)
- **ADMIN:** Puede acceder a todos los datos del sistema

---

## Flujo Completo de Uso

### 1. Registrar un nuevo usuario

```bash
curl -X POST http://localhost:3016/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "password123",
    "role": "PACIENTE",
    "nombre": "Juan Pérez",
    "telefono": "+51 987654321"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3016/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "password": "password123"
  }'
```

**Copiar el `access_token` de la respuesta.**

### 3. Obtener mi perfil

```bash
curl -X GET http://localhost:3016/api/paciente-profile/me \
  -H "Authorization: Bearer {access_token}"
```

### 4. Actualizar mi perfil

```bash
curl -X PUT http://localhost:3016/api/paciente-profile/me \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+51 999888777",
    "direccion": "Nueva dirección"
  }'
```

---

## Colección de Postman

Importa la colección de Postman incluida en el proyecto:

**Archivo:** `saludconecta-api.postman_collection.json`

La colección incluye:
- Todos los endpoints de Auth
- Todos los endpoints de Profiles
- Endpoints de Upload
- Variables de entorno preconfiguradas
- Ejemplos de requests

---

## Testing

### Ejecutar tests
```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

## Estructura del Proyecto

```
saludconecta-api/
├── src/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── dto/              # DTOs (register, login)
│   │   ├── schemas/          # Schema de User
│   │   ├── guards/           # Guards JWT y Roles
│   │   ├── decorators/       # Decoradores personalizados
│   │   └── auth.service.ts   # Lógica de autenticación
│   │
│   ├── paciente-profile/  # Profile PACIENTE
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── paciente-profile.controller.ts
│   │   ├── paciente-profile.service.ts
│   │   └── paciente-profile.module.ts
│   │
│   ├── medico-profile/  # Profile MEDICO
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── medico-profile.controller.ts
│   │   ├── medico-profile.service.ts
│   │   └── medico-profile.module.ts
│   │
│   ├── upload/               # Módulo de uploads
│   ├── app.module.ts         # Módulo principal
│   └── main.ts               # Entry point
│
├── uploads/                  # Imágenes subidas
│   └── thumbnails/           # Thumbnails generados
│
├── .env                      # Variables de entorno (development)
├── .env.production           # Variables de entorno (production)
├── saludconecta-api.postman_collection.json
└── package.json
```

---

## Solución de Problemas

### MongoDB no conecta

**Error:** `MongooseError: The 'uri' parameter to 'openUri()' must be a string`

**Solución:** Verifica que la variable `MONGODB_URI` esté configurada en `.env`

### Puerto en uso

**Error:** `EADDRINUSE: address already in use :::3000`

**Solución:** Cambia el puerto en `.env` o detén el proceso que está usando el puerto

### Token JWT inválido

**Error:** `401 Unauthorized`

**Solución:** Verifica que el token esté bien formado y no haya expirado. Genera uno nuevo haciendo login.

### Errores de validación

**Error:** `400 Bad Request - validation failed`

**Solución:** Revisa que todos los campos requeridos estén presentes y tengan el formato correcto. Consulta Swagger para ver los campos requeridos.

---

## Usuario Admin por Defecto

El sistema crea automáticamente un usuario ADMIN al iniciar:

```
Email: admin@sistema.com
Password: Admin123456
Role: ADMIN
```

**⚠️ IMPORTANTE:** Cambia estas credenciales en producción.

---

## Deployment

### Variables de Entorno Requeridas

```env
MONGODB_URI=<mongodb_connection_string>
JWT_SECRET=<secret_key>
JWT_EXPIRES_IN=7d
PORT=3016
NODE_ENV=production
```

### Railway

1. Crear nuevo proyecto en Railway
2. Conectar repositorio
3. Agregar MongoDB (Add Plugin → MongoDB)
4. Configurar variables de entorno
5. Deploy automático

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3016
CMD ["npm", "run", "start:prod"]
```

---

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto es parte de un ejercicio académico.

---

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Generado:** 2025-11-22
**Version:** 1.0.0
**Framework:** NestJS
**Base de datos:** MongoDB
