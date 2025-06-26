Aplicación web ligera que te permite obtener tu código QR de acceso a VivaGym sin necesidad de instalar su aplicación oficial. Privacidad ante todo: sin rastreadores, sin anuncios, sin intermediarios. Solo tú y tu QR.

> 💡 **Iimportante:** Esta aplicación ha sido probada en España. Puedes usarla sin depender de la app oficial de VivaGym.

### Prerrequisitos

- Node.js (versión 18 o superior)
- pnpm (recomendado) o npm

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd VivaGymQR/v2
```

2. Instala todas las dependencias:
```bash
pnpm run install:all
```

3. Configura las variables de entorno:
```bash
# Copia el archivo de ejemplo en el backend
cp backend/.env.example backend/.env
# Edita el archivo .env con tus configuraciones
```

### Ejecución en Desarrollo

Para arrancar tanto el backend como el frontend con un solo comando:

```bash
pnpm run dev
```
