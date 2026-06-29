# Darkside Bros — catálogo, carrito y panel admin

Next.js (App Router) + Supabase. Esquema de base de datos aislado en `darkside_bros`
dentro del proyecto Supabase compartido "Darkside Cafe" (no toca las tablas de
las otras tiendas que viven en ese mismo proyecto).

## Producción

- URL pública: https://pedidosbros.vercel.app/
- Admin: https://pedidosbros.vercel.app/admin (login con Google, cuenta
  `darksidebroscoleccionables@gmail.com`)
- Hospedado en Vercel. El despliegue inicial se hizo manualmente desde el dashboard
  de Vercel (sin pasar por una PR), con las variables de entorno descritas abajo.

## Configuración requerida en Supabase (una sola vez)

1. **Exponer el schema en la Data API**: Project Settings → Data API →
   "Exposed schemas" → agregar `darkside_bros` (junto a `public`).
   Sin esto, supabase-js no puede leer/escribir estas tablas.
2. **Login con Google**: Authentication → Providers → Google debe estar
   habilitado, con `Site URL` y `Redirect URLs` apuntando a
   `<tu-dominio>/auth/callback` (y `http://localhost:3000/auth/callback` en desarrollo).
3. **Admins**: la tabla `darkside_bros.admins` controla quién entra a `/admin`.
   Ya está cargado `darksidebroscoleccionables@gmail.com`; para agregar a alguien
   más, inserta su email ahí.

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=   # número en formato internacional sin signos, ej. 521XXXXXXXXXX
```

## Desarrollo

```bash
npm install
npm run dev
```

- `/` — catálogo público, filtrable por categoría.
- `/productos/[slug]` — detalle de producto.
- `/carrito` — carrito (localStorage) y checkout: crea el pedido en Supabase y
  abre WhatsApp con el resumen para coordinar pago/entrega (no hay pasarela de pago).
- `/login` — acceso con Google.
- `/admin` — panel (protegido por middleware, requiere estar en `darkside_bros.admins`):
  categorías, productos y pedidos.
