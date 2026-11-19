# Tarea 4 - Almacenamiento y consultas de datos en Big Data (MongoDB)

Curso Big Data (202016911) - UNAD - Grupo 202016911_16
Autor: Kevin Andrés Oliveros Canchila

Caso de uso: registro y consulta de facturas electrónicas de una firma contable.
Base de datos: `firma_contable` (colecciones `clientes`, `terceros` y `facturas`; 152 documentos de prueba).

## Archivos

- `01_crear_firma_contable.js`: crea la base de datos, inserta los 152 documentos y crea los índices.
- `02_consultas_firma_contable.js`: consultas CRUD, filtros y operadores, uniones con `$lookup`, agregaciones y tipos de dato.
- `capturas/`: capturas de pantalla de los resultados (opcional).

## Cómo ejecutarlo

1. Abrir MongoDB Compass o `mongosh` y conectarse a `mongodb://localhost:27017`.
2. Ejecutar `01_crear_firma_contable.js` (por ejemplo: `mongosh < 01_crear_firma_contable.js`).
3. Ejecutar las consultas de `02_consultas_firma_contable.js` una por una.

Los datos son de prueba.
