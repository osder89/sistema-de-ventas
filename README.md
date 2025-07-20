# Proyecto T3 + Next.js + Prisma + NextAuth (Discord)

## 🚀 Descripción

Base de proyecto generado con **T3 Stack** (Next.js + TypeScript + TailwindCSS + tRPC + Prisma + NextAuth). Usa **SQLite** por defecto para desarrollo (archivo `./prisma/db.sqlite`). Autenticación vía **Discord Provider** de NextAuth.

Este README te guía para levantar el entorno tras clonar el repositorio, configurar variables, ejecutar migraciones, seed (opcional) y correr en desarrollo / producción.

---

## 📦 Requisitos Previos

* Node.js >= 18
* npm run (recomendado) o yarn / npm
* Cuenta de Discord y una **Discord Application** para OAuth2

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz (puedes basarte en el ejemplo de más abajo). Para SQLite local no necesitas más que esto. Si cambias a Postgres/MySQL ajusta `DATABASE_URL`.

### Ejemplo `.env`

```env
# --- Auth Secrets ---
# Genera un valor seguro (por ejemplo: openssl rand -base64 32)
AUTH_SECRET="cambia_este_valor_super_secreto"

# --- NextAuth Discord Provider ---
AUTH_DISCORD_ID="TU_CLIENT_ID_DISCORD"
AUTH_DISCORD_SECRET="TU_CLIENT_SECRET_DISCORD"

# --- Prisma / Base de Datos ---
# Para SQLite local
DATABASE_URL="file:./db.sqlite"

# (Opcional) URL pública si la necesitas (ej: para callbacks en despliegue)
# NEXTAUTH_URL="https://tu-dominio.com"
```

> **Importante:** En NextAuth v5 (o experimental) `AUTH_SECRET` reemplaza a `NEXTAUTH_SECRET`. Asegúrate de que coincida con la versión que estás usando. Si tu scaffolding usa `NEXTAUTH_SECRET`, renombra la variable en consecuencia.

---

## 🛠️ Pasos para Levantar el Proyecto (Desarrollo)

1. **Clonar**

   ```bash
   ```

git clone \<URL\_DEL\_REPO> mi-proyecto
cd mi-proyecto

````
2. **Instalar dependencias**
   ```bash
npm run install
# o yarn / npm install
````

3. **Crear `.env`** (copiar el bloque de arriba y rellenar credenciales de Discord).
4. **Generar Cliente Prisma y Migrar**

   ```bash
   ```

npx prisma generate
npx prisma migrate dev --name init

````
   Esto crea/actualiza `prisma/db.sqlite` según `schema.prisma`.
5. **(Opcional) Seed de datos** (si existe `prisma/seed.ts`):
   ```bash
npx prisma db seed
````

6. **Levantar en modo dev**

   ```bash
   ```

npm run dev

```
7. Abrir `http://localhost:3000`.

---
## 🧪 Comandos Útiles
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Corre Next.js en modo desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Sirve la build de producción |
| `npm run lint` | Linter (ESLint) |
| `npx prisma generate` | Genera el cliente de Prisma |
| `npx prisma migrate dev` | Aplica migraciones en desarrollo |
| `npx prisma migrate deploy` | Aplica migraciones en producción (no crea nuevas) |
| `npx prisma studio` | Abre Prisma Studio para inspeccionar la DB |
| `npx prisma db seed` | Ejecuta script de seed (si configurado) |

---
## 🗃️ Estructura Prisma Básica
```

prisma/
├─ schema.prisma
└─ migrations/

````
Cuando cambies el modelo (schema), crea una nueva migración:
```bash
npx prisma migrate dev --name cambio_x
````

En producción usa:

```bash
npx prisma migrate deploy
```

---

## 🔑 Configurar Provider Discord

1. Ir a [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Crear Application > OAuth2 > **Add Redirect**: `http://localhost:3000/api/auth/callback/discord`
3. Copiar `CLIENT ID` y `CLIENT SECRET` a `.env` (`AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`).
4. En producción, agrega también la URL de producción: `https://tu-dominio.com/api/auth/callback/discord`.

---

## 🧩 Integración NextAuth (Referencia Rápida)

Archivo típico (ej. `src/server/auth.ts` o `src/pages/api/auth/[...nextauth].ts`):

```ts
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "~/server/db"; // tu export de prisma

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
```

> Ajusta el path/import según tu estructura real.

---

## 🛫 Despliegue (Ej: Vercel)

1. Subir repo a GitHub.
2. En Vercel: *New Project* > Importar repo.
3. Añadir variables de entorno (`AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `DATABASE_URL`, y `NEXTAUTH_URL` si se requiere) en *Project Settings > Environment Variables*.
4. Si usas SQLite solo localmente, para producción considera Postgres (Railway, Neon, Supabase, PlanetScale MySQL, etc.). Ajusta `DATABASE_URL` y crea migraciones:

   ```bash
   npx prisma migrate deploy
   ```
5. Redeploy.

### Ejemplo DATABASE\_URL (Postgres)

```
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"
```

---

## 🧪 Cambio de SQLite a Postgres (Rápido)

1. Instalar driver (si no viene): `npm install pg`.
2. Cambiar `provider = "postgresql"` en `schema.prisma`.
3. Ajustar `DATABASE_URL`.
4. Crear migración limpia (si estás temprano en el proyecto y puedes resetear):

   ```bash
   npx prisma migrate reset
   ```
5. Generar cliente y seed.

---

## 🧯 Troubleshooting

| Problema                              | Causa común                            | Solución                                             |
| ------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| `Environment variable not found`      | Falta en `.env`                        | Revisar nombres correctos (`AUTH_*`)                 |
| Error OAuth redirect mismatch         | Redirect URL no coincide               | Configurar exactamente la URL en el panel de Discord |
| `prisma migrate dev` se cuelga        | Archivo bloqueado / proceso abierto    | Cerrar Prisma Studio y reintentar                    |
| Cambié el schema y no refleja         | No corriste migración                  | `npx prisma migrate dev` + reiniciar dev             |
| 500 al autenticar                     | SECRET ausente o provider mal          | Asegurar `AUTH_SECRET` y credenciales Discord        |
| En producción no persiste DB (SQLite) | Archivo no es persistente entre builds | Migrar a Postgres/MySQL gestionado                   |

---

## 🧵 Scripts de Seed (Opcional)

Ejemplo `prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: { name: "Usuario Demo", email: "demo@example.com" }
  });
  console.log("Seed completado");
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

En `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Correr:

```bash
npx prisma db seed
```

---

## 🧹 Limpieza / Reset DB (Dev)

```bash
npx prisma migrate reset
# Confirma (esto borra datos) y re-seed si corresponde
```

---

## ✅ Checklist Rápido

* [ ] Cloné repo
* [ ] Instalé dependencias (`npm install`)
* [ ] Creé `.env` con `AUTH_SECRET`, Discord ID/Secret
* [ ] `npx prisma migrate dev`
* [ ] (Opcional) Seed (`npx prisma db seed`)
* [ ] `npm run dev`
* [ ] Login con Discord probado
