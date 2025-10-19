# Instrucciones para Carga Masiva de Clientes y Suscripciones

## 📋 Descripción

Este sistema permite importar múltiples clientes con sus suscripciones usando archivos JSON o CSV.

## 🚀 Cómo Usar

### 1. **Preparar el Archivo**

#### Formato JSON (Recomendado):

```json
[
  {
    "firstName": "Juan",
    "lastName": "Pérez",
    "cedula": "V-12345678",
    "email": "juan.perez@example.com",
    "phone": "+58 212 123 4567",
    "address": "Av. Principal 123, Caracas",
    "planId": "PLAN002",
    "subscriptionStatus": "Activo"
  }
]
```

#### Formato CSV:

```csv
firstName,lastName,cedula,email,phone,address,planId,subscriptionStatus
Juan,Pérez,V-12345678,juan.perez@example.com,+58 212 123 4567,"Av. Principal 123, Caracas",PLAN002,Activo
```

### 2. **Campos del Archivo**

#### Campos Obligatorios:

- `firstName`: Nombre del cliente
- `lastName`: Apellido del cliente
- `cedula`: Cédula de identidad (ej: V-12345678)
- `email`: Correo electrónico
- `phone`: Teléfono de contacto
- `address`: Dirección completa

#### Campos Opcionales (para crear suscripción):

- `planId`: ID del plan de suscripción

  - PLAN001: Plan Básico ($25/mes)
  - PLAN002: Plan Premium ($45/mes)
  - PLAN003: Plan Elite ($75/mes)
  - PLAN004: Plan Estudiantil ($20/mes)
  - PLAN005: Plan Anual Premium ($450/año)
  - PLAN006: Plan Familiar ($85/mes)

- `subscriptionStatus`: Estado de la suscripción
  - "Activo"
  - "En Apelación"
  - "Cancelado"

### 3. **Realizar la Carga**

1. Navega a: **Dashboard → Nuevo Cliente**
2. En el lado derecho verás el componente "Carga Masiva de Clientes"
3. Arrastra tu archivo JSON/CSV o haz clic para seleccionarlo
4. Espera a que se procese el archivo
5. Verás un mensaje de éxito indicando cuántos clientes y suscripciones se crearon

### 4. **Verificar los Resultados**

#### Ver Clientes:

- Ve a: **Dashboard → Clientes**
- Deberías ver todos los clientes importados en la tabla

#### Ver Suscripciones:

- Ve a: **Dashboard → Suscripciones**
- En la pestaña "Suscripciones de Clientes" verás todas las suscripciones creadas
- Verás badges con los contadores actualizados (Activos, En Apelación, Cancelados)

### 5. **Solución de Problemas**

#### Si no ves las suscripciones:

1. **Verifica que el archivo tenga el campo `planId`**: Sin este campo, solo se crean clientes sin suscripción
2. **Verifica que el `planId` sea válido**: Usa uno de los IDs listados arriba
3. **Refresca la página**: Presiona F5 para recargar los datos del localStorage
4. **Abre la consola del navegador** (F12):
   - Busca mensajes de warning (`⚠️`) que indiquen planes no encontrados
   - Verifica que no haya errores de JavaScript

#### Si el CSV no se procesa correctamente:

1. **Verifica que la primera línea tenga los nombres de columnas**
2. **Si las direcciones tienen comas**, enciérralas entre comillas dobles:
   ```csv
   Juan,Pérez,V-12345678,juan@example.com,+58 212 123,"Av. Principal 123, Caracas",PLAN002,Activo
   ```
3. **Verifica que no haya líneas vacías** al final del archivo

#### Si el JSON no se procesa:

1. **Valida que el JSON sea correcto** usando jsonlint.com
2. **Verifica que sea un array** `[ ... ]` y no un objeto `{ ... }`
3. **Asegúrate de que todas las comillas sean dobles** `"` y no simples `'`

### 6. **Archivos de Ejemplo Incluidos**

En la carpeta `public/` encontrarás:

- `ejemplo-carga-masiva.json`: Ejemplo con 5 clientes completos
- `ejemplo-carga-masiva.csv`: El mismo ejemplo en formato CSV
- `test-carga.json`: Un solo cliente para pruebas rápidas

### 7. **Características Adicionales**

- ✅ **IDs únicos automáticos**: El sistema genera IDs únicos para cada cliente y suscripción
- ✅ **Cálculo automático de fechas**: La próxima fecha de pago se calcula según el ciclo de facturación
- ✅ **Validación de datos**: Se verifican todos los campos obligatorios
- ✅ **Manejo de errores**: Mensajes claros si algo falla
- ✅ **Persistencia automática**: Los datos se guardan en localStorage automáticamente

### 8. **Notas Importantes**

- Los clientes sin `planId` se crean sin suscripción (pueden agregarse después manualmente)
- Si un plan no existe, se crea el cliente pero no la suscripción
- Los datos se persisten en localStorage del navegador
- Puedes importar el mismo archivo varias veces (se crearán registros duplicados con IDs diferentes)

### 9. **Soporte**

Si tienes problemas:

1. Verifica la consola del navegador (F12)
2. Prueba con el archivo `test-carga.json` primero
3. Asegúrate de que los planes existan en: **Dashboard → Suscripciones → Planes Disponibles**

---

**¡Listo!** Ahora puedes importar clientes y suscripciones de forma masiva. 🎉
