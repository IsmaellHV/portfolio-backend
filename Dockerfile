# Imagen para compilar
FROM node:latest as builder
#Node en modo producción
ENV NODE_ENV production
#Se instala node prune
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
#Se trabaja en la carpeta app
WORKDIR /app
#Se copia el package json para instalar las dependencias
COPY package.json /app
#Se instala las dependencias del ambiente productivo
RUN npm install
#Se copia los archivos del proyecto
COPY build /app
#Se desintala dependencias ajenas al ambiente productivo
# RUN npm prune --production
#Se ejecuta node-prube en las dependencias del proyecto
# RUN /usr/local/bin/node-prune

#Imagen que ejecutará el proyecto
FROM node:lts-slim as runner

#Node en modo producción
ENV NODE_ENV production
#Se trabaja en la carpeta app
WORKDIR /app
#Se copia lo ejecutado del builder al runner
COPY --from=builder /app /app
#Se ejecuta el proyecto
CMD node index.js
#Se expone el puerto
EXPOSE 80
