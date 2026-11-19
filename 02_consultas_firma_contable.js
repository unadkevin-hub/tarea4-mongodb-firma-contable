// =====================================================
// Tarea 4 - Big Data UNAD (202016911)
// Caso: facturas electrónicas de una firma contable
// Script 2: consultas para los pantallazos
// Ejecutar UNA POR UNA en mongosh o en la pestaña _MONGOSH de Compass
// (primero correr: use firma_contable)
// =====================================================

use firma_contable

// =====================================================
// A. CONSULTAS BÁSICAS (CRUD)
// =====================================================

// A1. INSERCIÓN: registrar una factura nueva de venta
db.facturas.insertOne({
  _id: "F0121",
  prefijo: "FV",
  numero: 1121,
  cufe: "cufe-2026-0121-55555",
  fecha: new Date("2026-11-10T10:30:00Z"),
  tipo: "venta",
  cliente_id: "CL01",
  tercero_id: "T14",
  items: [
    { descripcion: "Taladro percutor", cantidad: 2, valor_unitario: 289000, subtotal: 578000 },
    { descripcion: "Juego de llaves mixtas", cantidad: 1, valor_unitario: 95000, subtotal: 95000 }
  ],
  subtotal: 673000,
  impuestos: { iva: 127870, retefuente: 0 },
  total: 800870,
  forma_pago: "contado",
  estado: "registrada"
})

// A2. SELECCIÓN: ver la factura recién insertada
db.facturas.findOne({ _id: "F0121" })

// A3. SELECCIÓN: las facturas de un cliente (solo campos clave)
db.facturas.find(
  { cliente_id: "CL01" },
  { fecha: 1, tipo: 1, total: 1, estado: 1 }
).limit(5)

// A4. ACTUALIZACIÓN: el cliente pagó la factura F0121
db.facturas.updateOne(
  { _id: "F0121" },
  { $set: { estado: "pagada", fecha_pago: new Date("2026-11-11") } }
)

// A5. ACTUALIZACIÓN múltiple: marcar revisadas todas las facturas anuladas
db.facturas.updateMany(
  { estado: "anulada" },
  { $set: { revisada: true } }
)

// A6. ELIMINACIÓN: borrar la factura de prueba
db.facturas.deleteOne({ _id: "F0121" })

// A7. Verificar que quedó eliminada (debe devolver null)
db.facturas.findOne({ _id: "F0121" })

// =====================================================
// B. CONSULTAS CON FILTROS Y OPERADORES
// =====================================================

// B1. Facturas de más de 3 millones ($gt) ordenadas de mayor a menor
db.facturas.find(
  { total: { $gt: 3000000 } },
  { cliente_id: 1, tipo: 1, total: 1 }
).sort({ total: -1 }).limit(5)

// B2. Facturas de venta pagadas de septiembre ($gte, $lt y condición combinada)
db.facturas.find({
  tipo: "venta",
  estado: "pagada",
  fecha: { $gte: new Date("2026-09-01"), $lt: new Date("2026-10-01") }
}, { cliente_id: 1, fecha: 1, total: 1 }).limit(5)

// B3. Facturas con IVA o con retención ($or y $gt sobre subdocumento)
db.facturas.find({
  $or: [ { "impuestos.iva": { $gt: 0 } }, { "impuestos.retefuente": { $gt: 0 } } ]
}).count()

// B4. Facturas que incluyen combustible ($elemMatch sobre el arreglo de ítems)
db.facturas.find(
  { items: { $elemMatch: { descripcion: /diésel|gasolina/i } } },
  { cliente_id: 1, "items.descripcion": 1, total: 1 }
).limit(3)

// B5. Clientes persona natural de Sincelejo ($and implícito e $in)
db.clientes.find(
  { tipo_persona: "natural", ciudad: { $in: ["Sincelejo", "Sampués"] } },
  { nombre: 1, nit: 1, regimen: 1 }
)

// B6. JOIN con $lookup: facturas con los datos completos de su cliente
db.facturas.aggregate([
  { $match: { estado: "pagada" } },
  { $lookup: {
      from: "clientes",
      localField: "cliente_id",
      foreignField: "_id",
      as: "cliente"
  }},
  { $unwind: "$cliente" },
  { $project: { fecha: 1, tipo: 1, total: 1, "cliente.nombre": 1, "cliente.nit": 1 } },
  { $limit: 5 }
])

// B7. JOIN doble: factura + cliente + tercero
db.facturas.aggregate([
  { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
  { $lookup: { from: "terceros", localField: "tercero_id", foreignField: "_id", as: "tercero" } },
  { $unwind: "$cliente" },
  { $unwind: "$tercero" },
  { $project: { tipo: 1, total: 1, "cliente.nombre": 1, "tercero.nombre": 1, "tercero.ciudad": 1 } },
  { $limit: 5 }
])

// =====================================================
// C. CONSULTAS DE AGREGACIÓN (ESTADÍSTICAS)
// =====================================================

// C1. CONTAR: número de facturas por estado
db.facturas.aggregate([
  { $group: { _id: "$estado", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
])

// C2. SUMAR: total facturado y total de IVA por tipo (compra vs venta)
db.facturas.aggregate([
  { $match: { estado: { $ne: "anulada" } } },
  { $group: {
      _id: "$tipo",
      total_facturado: { $sum: "$total" },
      total_iva: { $sum: "$impuestos.iva" },
      facturas: { $sum: 1 }
  }}
])

// C3. PROMEDIAR: valor promedio, mínimo y máximo de factura por cliente
db.facturas.aggregate([
  { $match: { estado: { $ne: "anulada" } } },
  { $group: {
      _id: "$cliente_id",
      promedio: { $avg: "$total" },
      minima: { $min: "$total" },
      maxima: { $max: "$total" },
      facturas: { $sum: 1 }
  }},
  { $sort: { promedio: -1 } },
  { $limit: 5 }
])

// C4. IVA mensual por cliente, separando ventas (IVA generado) y compras (IVA descontable)
db.facturas.aggregate([
  { $match: { "impuestos.iva": { $gt: 0 }, estado: { $ne: "anulada" } } },
  { $group: {
      _id: { cliente: "$cliente_id", anio: { $year: "$fecha" }, mes: { $month: "$fecha" } },
      iva_ventas: { $sum: { $cond: [{ $eq: ["$tipo", "venta"] }, "$impuestos.iva", 0] } },
      iva_compras: { $sum: { $cond: [{ $eq: ["$tipo", "compra"] }, "$impuestos.iva", 0] } },
      facturas: { $sum: 1 }
  }},
  { $project: {
      _id: 0, cliente: "$_id.cliente", anio: "$_id.anio", mes: "$_id.mes",
      iva_ventas: 1, iva_compras: 1, facturas: 1,
      iva_por_pagar: { $subtract: ["$iva_ventas", "$iva_compras"] }
  }},
  { $sort: { cliente: 1, anio: 1, mes: 1 } },
  { $limit: 6 }
])

// C5. Top 5 productos/servicios más facturados ($unwind del arreglo de ítems)
db.facturas.aggregate([
  { $unwind: "$items" },
  { $group: {
      _id: "$items.descripcion",
      unidades: { $sum: "$items.cantidad" },
      valor_total: { $sum: "$items.subtotal" }
  }},
  { $sort: { valor_total: -1 } },
  { $limit: 5 }
])

// C6. Total pagado por cliente, separando ventas y compras, con $lookup para el nombre
db.facturas.aggregate([
  { $match: { estado: "pagada" } },
  { $group: {
      _id: "$cliente_id",
      ventas_pagadas: { $sum: { $cond: [{ $eq: ["$tipo", "venta"] }, "$total", 0] } },
      compras_pagadas: { $sum: { $cond: [{ $eq: ["$tipo", "compra"] }, "$total", 0] } },
      facturas: { $sum: 1 }
  }},
  { $lookup: { from: "clientes", localField: "_id", foreignField: "_id", as: "cliente" } },
  { $unwind: "$cliente" },
  { $project: { _id: 0, cliente: "$cliente.nombre", ventas_pagadas: 1, compras_pagadas: 1, facturas: 1 } },
  { $sort: { ventas_pagadas: -1 } },
  { $limit: 5 }
])

// C7. Tipos de dato de los campos de una factura
db.facturas.aggregate([
  { $limit: 1 },
  { $project: { _id: { $type: "$_id" }, fecha: { $type: "$fecha" }, total: { $type: "$total" },
      items: { $type: "$items" }, impuestos: { $type: "$impuestos" }, estado: { $type: "$estado" } } }
])
