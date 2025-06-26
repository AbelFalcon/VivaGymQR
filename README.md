![imagen](https://github.com/user-attachments/assets/1645ba84-056c-4384-8dc8-27a5acc55050)

Aplicación web ligera que te permite obtener tu código QR de acceso a VivaGym sin necesidad de instalar la oficial. Privacidad ante todo: sin rastreadores, sin anuncios, sin intermediarios. Solo tú y tu QR.
| ![QR VivaGym 1](https://github.com/user-attachments/assets/2d539246-dcd1-4670-a1b0-218412aa0414) | ![QR VivaGym 2](https://github.com/user-attachments/assets/ebc0e628-fd1f-4986-a45e-3d399b98307f) |
|:--:|:--:|

> 💡 **Iimportante:** Esta aplicación ha sido probada en España. Puedes usarla sin depender de la app oficial de VivaGym.

### Prerrequisitos

- Node.js (versión 18 o superior)
- pnpm (recomendado) o npm

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/AbelFalcon/VivaGymQR
cd VivaGymQR
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
