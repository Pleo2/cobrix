# Integración de Zustand - Dashboard Store

## 📋 Resumen

Se ha implementado un sistema centralizado de gestión de datos utilizando **Zustand** con persistencia en **localStorage** para todo el dashboard. Esto garantiza coherencia y sincronización de datos en todas las páginas y componentes.

## 🗂️ Estructura del Store

### Archivo Principal

- **`src/store/dashboard-store.ts`** - Store centralizado con todas las entidades del dashboard

### Entidades Gestionadas

1. **Clientes** (`clients`)

   - Campos: id, firstName, lastName, cedula, email, phone, address, createdAt
   - Acciones: addClient, updateClient, deleteClient

2. **Transacciones** (`transactions`)

   - Campos: id, cliente, concepto, monto, metodoPago, estado, fecha, referencia
   - Acciones: addTransaction, updateTransaction, deleteTransaction

3. **Facturas/Recibos** (`invoices`)

   - Campos: id, invoice_number, client, email, amount, status, date, due_date, plan_type, payment_method, exchange_rate
   - Acciones: addInvoice, updateInvoice, deleteInvoice

4. **Suscripciones** (`subscriptions`)

   - Campos: id, plan, price, status, billingCycle, nextPayment
   - Acciones: addSubscription, updateSubscription, deleteSubscription

5. **Plantillas de Mensajes** (`messageTemplates`)

   - Campos: id, title, description, category, content, createdAt
   - Acciones: addMessageTemplate, updateMessageTemplate, deleteMessageTemplate

6. **Perfiles de Clientes** (`clientProfiles`)

   - Campos: id, title, description, category, features, createdAt
   - Acciones: addClientProfile, updateClientProfile, deleteClientProfile

7. **Plantillas de Pantallas** (`screenTemplates`)
   - Campos: id, title, description, category, components, createdAt
   - Acciones: addScreenTemplate, updateScreenTemplate, deleteScreenTemplate

### Funciones Derivadas

- `getClientsCount()` - Retorna el total de clientes
- `getActiveSubscriptionsCount()` - Retorna suscripciones activas
- `getPendingInvoicesCount()` - Retorna facturas pendientes
- `getTotalRevenue()` - Calcula ingresos totales de transacciones completadas

## 📄 Archivos Actualizados

### Páginas del Dashboard

1. **`src/app/(main)/account/@dashboard/page.tsx`**

   - ✅ Usa `getClientsCount()` para el badge de clientes
   - ✅ Usa `getActiveSubscriptionsCount()` para el badge de suscripciones
   - ✅ Usa `getPendingInvoicesCount()` para el badge de facturas
   - ✅ Inicializa desde localStorage con `initializeFromLocalStorage()`

2. **`src/app/(main)/account/@dashboard/clients/page.tsx`**

   - ✅ Lee `clients` directamente del store
   - ✅ Elimina dependencia de localStorage directo

3. **`src/app/(main)/account/@dashboard/new-client/page.tsx`**

   - ✅ Usa `addClient()` del store
   - ✅ Elimina localStorage.setItem manual

4. **`src/app/(main)/account/@dashboard/invoices/page.tsx`**

   - ✅ Lee `invoices` del store
   - ✅ Elimina data hardcodeada

5. **`src/app/(main)/account/@dashboard/dashboard/page.tsx`**

   - ✅ Lee `transactions` del store
   - ✅ Elimina import de data.json

6. **`src/app/(main)/account/@dashboard/message-handler/page.tsx`**

   - ✅ Lee `messageTemplates` del store
   - ✅ Elimina data hardcodeada

7. **`src/app/(main)/account/@dashboard/library-profile/page.tsx`**

   - ✅ Lee `clientProfiles` del store
   - ✅ Elimina data hardcodeada

8. **`src/app/(main)/account/@dashboard/create-template/page.tsx`**
   - ✅ Lee `screenTemplates` del store
   - ✅ Elimina data hardcodeada

### Componentes

1. **`src/components/acount/dashboard/bulk-upload-dropzone.tsx`**

   - ✅ Usa `addClient()` del store para carga masiva
   - ✅ Elimina localStorage.setItem manual

2. **`src/components/acount/dashboard/section-cards.tsx`**
   - ✅ Usa `getTotalRevenue()` para ingresos totales
   - ✅ Usa `getClientsCount()` para total de clientes
   - ✅ Usa `getActiveSubscriptionsCount()` para suscripciones activas

## 🔄 Flujo de Datos

### Antes (❌ Problemas)

```
Componente A → localStorage → Componente B
     ↓                              ↓
Data inconsistente          Data desactualizada
```

### Después (✅ Solución)

```
Componente A → Zustand Store → Componente B
                    ↓
            localStorage (persist)
                    ↓
          Sincronización automática
```

## 🚀 Ventajas de la Implementación

1. **Fuente Única de Verdad**

   - Todos los componentes leen del mismo store
   - No hay duplicación de datos

2. **Persistencia Automática**

   - Zustand persist middleware guarda automáticamente en localStorage
   - Los datos persisten entre sesiones

3. **Sincronización en Tiempo Real**

   - Cambios en un componente se reflejan instantáneamente en todos
   - Reactividad automática con hooks

4. **Datos Derivados Consistentes**

   - Contadores y estadísticas se calculan dinámicamente
   - Siempre están actualizados

5. **Escalabilidad**
   - Fácil agregar nuevas entidades
   - Estructura modular y organizada

## 📝 Uso en Componentes

### Leer Datos

```typescript
import { useDashboardStore } from "@/store/dashboard-store";

function MyComponent() {
  const clients = useDashboardStore((state) => state.clients);
  const getClientsCount = useDashboardStore((state) => state.getClientsCount);

  const count = getClientsCount();

  return <div>{count} clientes</div>;
}
```

### Agregar Datos

```typescript
import { useDashboardStore } from "@/store/dashboard-store";

function AddClientForm() {
  const addClient = useDashboardStore((state) => state.addClient);

  const handleSubmit = (data) => {
    addClient(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Actualizar Datos

```typescript
import { useDashboardStore } from "@/store/dashboard-store";

function EditClient({ clientId }) {
  const updateClient = useDashboardStore((state) => state.updateClient);

  const handleUpdate = (data) => {
    updateClient(clientId, data);
  };

  return <form onSubmit={handleUpdate}>...</form>;
}
```

## 🔧 Migración desde localStorage Antiguo

El store incluye la función `initializeFromLocalStorage()` que:

- Lee datos antiguos de localStorage (si existen)
- Los migra al nuevo store de Zustand
- Limpia las claves antiguas de localStorage

```typescript
useEffect(() => {
  initializeFromLocalStorage();
}, []);
```

## ⚠️ Consideraciones

1. **Data Inicial**

   - El store viene pre-cargado con data de ejemplo para transacciones, facturas, templates, etc.
   - Los clientes empiezan vacíos (se migran desde localStorage si existen)

2. **IDs Únicos**

   - Todos los IDs se generan con `Date.now()` para garantizar unicidad
   - Para producción, considerar usar UUID

3. **Validación**

   - Agregar validación de datos con Zod antes de guardar en el store
   - Implementar tipos estrictos para mayor seguridad

4. **Performance**
   - Zustand es muy eficiente, solo re-renderiza componentes que usan datos cambiados
   - El persist middleware es asíncrono y no bloquea la UI

## 📚 Próximos Pasos

1. **Autenticación**

   - Vincular datos del dashboard con el usuario autenticado
   - Implementar multi-tenant si es necesario

2. **API Backend**

   - Reemplazar localStorage con llamadas a API
   - Mantener Zustand como cache local

3. **Optimistic Updates**

   - Actualizar UI inmediatamente
   - Sincronizar con backend en segundo plano

4. **Validación Avanzada**

   - Schemas de Zod para todas las entidades
   - Validación en tiempo real

5. **Testing**
   - Unit tests para el store
   - Integration tests para flujos completos

## 🎉 Resultado

✅ **Sistema Completamente Sincronizado**

- Todos los contadores dinámicos funcionan correctamente
- Data consistente en todo el dashboard
- Persistencia automática
- Código más limpio y mantenible
