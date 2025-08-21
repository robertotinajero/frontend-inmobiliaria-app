# Etapa 1: Compilación de la aplicación con Vite
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente de la aplicación
COPY . /app

ENV VITE_API_URL=/api
# Instalar las dependencias del proyecto
RUN npm install

# Ejecutar el script de compilación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa 'builder' al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para acceder a la aplicación
EXPOSE 80

# Comando para iniciar Nginx cuando el contenedor se inicie
CMD ["nginx", "-g", "daemon off;"]
