// =====================================================
// Tarea 4 - Big Data UNAD (202016911)
// Caso de uso: Registro y consulta de facturas electrónicas
//              para una firma contable
// Script 1: crea la base de datos e inserta los datos de prueba
// Colecciones: clientes (12) + terceros (20) + facturas (120) = 152 documentos
// Uso en mongosh:  load("01_crear_firma_contable.js")
// O copiar y pegar todo en la pestaña _MONGOSH de Compass
// =====================================================

db = db.getSiblingDB("firma_contable");

// Limpia por si se corre otra vez
db.clientes.drop();
db.terceros.drop();
db.facturas.drop();

// ---------- COLECCIÓN CLIENTES (12) ----------
// Clientes de la firma: los que generan o reciben las facturas
const clientes = [
  { _id: "CL01", nombre: "Ferretería El Tornillo SAS",      nit: "901111222-1", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "4752 - Venta de artículos de ferretería", ciudad: "Sincelejo", contacto: { nombre: "Humberto Salas",  telefono: "3101112233", email: "gerencia@eltornillo.com" } },
  { _id: "CL02", nombre: "Droguería Vida Sana",             nit: "901222333-2", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "4773 - Comercio de productos farmacéuticos", ciudad: "Sincelejo", contacto: { nombre: "Marta Ligia Paternina", telefono: "3102223344", email: "drogueriavidasana@gmail.com" } },
  { _id: "CL03", nombre: "Transportes La Sabana SAS",       nit: "901333444-3", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "4923 - Transporte de carga por carretera", ciudad: "Corozal", contacto: { nombre: "Edgar Montes", telefono: "3103334455", email: "transporteslasabana@hotmail.com" } },
  { _id: "CL04", nombre: "Restaurante Donde Chela",         nit: "33444555-4",  tipo_persona: "natural",  regimen: "no_responsable_iva", actividad: "5611 - Expendio de comidas preparadas", ciudad: "Sincelejo", contacto: { nombre: "Graciela Mendoza", telefono: "3104445566", email: "dondechela@gmail.com" } },
  { _id: "CL05", nombre: "Constructora Sabanas del Golfo",  nit: "901555666-5", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "4111 - Construcción de edificios residenciales", ciudad: "Sincelejo", contacto: { nombre: "Iván Darío Paz", telefono: "3105556677", email: "info@sabanasdelgolfo.com" } },
  { _id: "CL06", nombre: "Papelería y Variedades Génesis",  nit: "44555666-6",  tipo_persona: "natural",  regimen: "no_responsable_iva", actividad: "4761 - Comercio de libros y papelería", ciudad: "Sampués", contacto: { nombre: "Yulieth Barreto", telefono: "3106667788", email: "papeleriagenesis@gmail.com" } },
  { _id: "CL07", nombre: "Agropecuaria Los Corrales SAS",   nit: "901777888-7", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "0141 - Cría de ganado bovino", ciudad: "Corozal", contacto: { nombre: "Libardo Vergara", telefono: "3107778899", email: "loscorrales@outlook.com" } },
  { _id: "CL08", nombre: "Estación de Servicio El Crucero", nit: "901888999-8", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "4731 - Comercio al por menor de combustible", ciudad: "Sincelejo", contacto: { nombre: "Nohemí Arrieta", telefono: "3108889900", email: "eselcrucero@gmail.com" } },
  { _id: "CL09", nombre: "Consultorio Odontológico Sonría", nit: "55666777-9",  tipo_persona: "natural",  regimen: "no_responsable_iva", actividad: "8622 - Actividades de la práctica odontológica", ciudad: "Sincelejo", contacto: { nombre: "Karina Pacheco", telefono: "3109990011", email: "odontosonria@gmail.com" } },
  { _id: "CL10", nombre: "Distribuciones El Mayorista SAS", nit: "901999000-0", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "4631 - Comercio al por mayor de alimentos", ciudad: "Sincelejo", contacto: { nombre: "Remberto Julio", telefono: "3111112233", email: "ventas@elmayorista.com" } },
  { _id: "CL11", nombre: "Academia de Inglés Speak Up",     nit: "66777888-1",  tipo_persona: "natural",  regimen: "no_responsable_iva", actividad: "8551 - Formación académica no formal", ciudad: "Sincelejo", contacto: { nombre: "Jairo Benavides", telefono: "3112223344", email: "speakupsincelejo@gmail.com" } },
  { _id: "CL12", nombre: "Hotel Portal de la Sabana",       nit: "901000111-2", tipo_persona: "juridica", regimen: "responsable_iva",    actividad: "5511 - Alojamiento en hoteles", ciudad: "Sincelejo", contacto: { nombre: "Dina Luz Romero", telefono: "3113334455", email: "reservas@portalsabana.com" } }
];
db.clientes.insertMany(clientes);

// ---------- COLECCIÓN TERCEROS (20) ----------
// Proveedores y compradores con los que negocian los clientes de la firma
const terceros = [
  { _id: "T01", nombre: "Abastos del Caribe SAS",          nit: "800111222-1", tipo: "proveedor", ciudad: "Barranquilla" },
  { _id: "T02", nombre: "Importadora Ferretera Nacional",  nit: "800222333-2", tipo: "proveedor", ciudad: "Medellín" },
  { _id: "T03", nombre: "Laboratorios Farma Colombia",     nit: "800333444-3", tipo: "proveedor", ciudad: "Bogotá" },
  { _id: "T04", nombre: "Cementos de la Costa",            nit: "800444555-4", tipo: "proveedor", ciudad: "Cartagena" },
  { _id: "T05", nombre: "Organización Terpel SA",          nit: "800555666-5", tipo: "proveedor", ciudad: "Bogotá" },
  { _id: "T06", nombre: "Distribuidora Papelera Andina",   nit: "800666777-6", tipo: "proveedor", ciudad: "Medellín" },
  { _id: "T07", nombre: "Agroinsumos de Sucre",            nit: "800777888-7", tipo: "proveedor", ciudad: "Sincelejo" },
  { _id: "T08", nombre: "Alimentos La Granja SAS",         nit: "800888999-8", tipo: "proveedor", ciudad: "Montería" },
  { _id: "T09", nombre: "Textiles y Dotaciones del Norte", nit: "800999000-9", tipo: "proveedor", ciudad: "Barranquilla" },
  { _id: "T10", nombre: "Tecnología y Redes del Caribe",   nit: "801000111-0", tipo: "proveedor", ciudad: "Sincelejo" },
  { _id: "T11", nombre: "Alcaldía de Sincelejo",           nit: "890280002-1", tipo: "comprador", ciudad: "Sincelejo" },
  { _id: "T12", nombre: "Gobernación de Sucre",            nit: "892280017-2", tipo: "comprador", ciudad: "Sincelejo" },
  { _id: "T13", nombre: "Comercializadora La Espiga",      nit: "802111222-3", tipo: "comprador", ciudad: "Sampués" },
  { _id: "T14", nombre: "Supermercados Mercatodo SAS",     nit: "802222333-4", tipo: "comprador", ciudad: "Sincelejo" },
  { _id: "T15", nombre: "Clínica Santa María de Sucre",    nit: "802333444-5", tipo: "comprador", ciudad: "Sincelejo" },
  { _id: "T16", nombre: "Universidad de Sucre",            nit: "892280021-6", tipo: "comprador", ciudad: "Sincelejo" },
  { _id: "T17", nombre: "Ganadería El Palmar",             nit: "802555666-7", tipo: "comprador", ciudad: "Corozal" },
  { _id: "T18", nombre: "Inversiones Turísticas del Golfo",nit: "802666777-8", tipo: "comprador", ciudad: "Coveñas" },
  { _id: "T19", nombre: "Colegio Bilingüe La Anunciación", nit: "802777888-9", tipo: "comprador", ciudad: "Sincelejo" },
  { _id: "T20", nombre: "Cooperativa de Transportadores",  nit: "802888999-0", tipo: "comprador", ciudad: "Corozal" }
];
db.terceros.insertMany(terceros);

// ---------- COLECCIÓN FACTURAS (120) ----------
// Se generan con un "aleatorio" de semilla fija para que
// siempre salgan los mismos datos al repetir el script
let semilla = 2026;
function aleatorio() {
  semilla = (semilla * 9301 + 49297) % 233280;
  return semilla / 233280;
}
function entre(min, max) { return Math.floor(aleatorio() * (max - min + 1)) + min; }
function elegir(lista) { return lista[entre(0, lista.length - 1)]; }

const conceptos = [
  ["Cemento gris x 50 kg", 23500], ["Varilla corrugada 1/2", 18900],
  ["Pintura blanca galón", 48000], ["Resma papel carta", 14500],
  ["Tóner impresora", 185000], ["Acetaminofén caja x100", 9800],
  ["Vitamina C frasco", 15600], ["Combustible diésel galón", 9400],
  ["Gasolina corriente galón", 10200], ["Flete Sincelejo-Barranquilla", 450000],
  ["Flete Corozal-Montería", 280000], ["Mercado institucional canasta", 89000],
  ["Almuerzo ejecutivo", 15000], ["Refrigerios evento x unidad", 8500],
  ["Consulta odontológica", 60000], ["Profilaxis dental", 90000],
  ["Curso de inglés mensualidad", 180000], ["Material didáctico kit", 45000],
  ["Noche de alojamiento estándar", 145000], ["Salón de eventos día", 650000],
  ["Bulto de maíz x 40 kg", 72000], ["Sal mineralizada x 25 kg", 58000],
  ["Novillo en pie kg", 8900], ["Servicio técnico redes hora", 65000],
  ["Mantenimiento aire acondicionado", 120000], ["Dotación uniformes x unidad", 78000],
  ["Taladro percutor", 289000], ["Juego de llaves mixtas", 95000],
  ["Alambre de púas rollo", 112000], ["Tubería PVC 4 pulgadas x unidad", 34000]
];
const estados = ["registrada", "pagada", "pagada", "pagada", "anulada"]; // más pagadas que anuladas
const formasPago = ["contado", "credito_30", "credito_60"];

const facturas = [];
for (let i = 1; i <= 120; i++) {
  const cliente = elegir(clientes);
  const tercero = elegir(terceros);
  // Si el tercero es proveedor, el cliente compra; si es comprador, el cliente vende
  const tipo = (tercero.tipo === "proveedor") ? "compra" : "venta";

  const numItems = entre(1, 4);
  const items = [];
  const usados = new Set();
  while (items.length < numItems) {
    const c = elegir(conceptos);
    if (usados.has(c[0])) continue;
    usados.add(c[0]);
    const cantidad = entre(1, 10);
    items.push({
      descripcion: c[0],
      cantidad: cantidad,
      valor_unitario: c[1],
      subtotal: cantidad * c[1]
    });
  }
  const subtotal = items.reduce((s, it) => s + it.subtotal, 0);

  // IVA del 19 % solo si el cliente es responsable de IVA (2 de cada 3 facturas gravadas)
  const llevaIva = (cliente.regimen === "responsable_iva") && (entre(1, 3) > 1);
  const iva = llevaIva ? Math.round(subtotal * 0.19) : 0;

  // Retención en la fuente del 2.5 % si el subtotal supera un millón
  const llevaRete = subtotal > 1000000;
  const retefuente = llevaRete ? Math.round(subtotal * 0.025) : 0;

  const dia = entre(0, 89); // del 1 de agosto al 29 de octubre de 2026
  const fecha = new Date(Date.UTC(2026, 7, 1 + dia, entre(8, 18), entre(0, 59)));

  facturas.push({
    _id: "F" + String(i).padStart(4, "0"),
    prefijo: (tipo === "venta") ? "FV" : "FC",
    numero: 1000 + i,
    cufe: "cufe-2026-" + String(i).padStart(4, "0") + "-" + entre(10000, 99999),
    fecha: fecha,
    tipo: tipo,
    cliente_id: cliente._id,
    tercero_id: tercero._id,
    items: items,
    subtotal: subtotal,
    impuestos: { iva: iva, retefuente: retefuente },
    total: subtotal + iva - retefuente,
    forma_pago: elegir(formasPago),
    estado: elegir(estados)
  });
}
db.facturas.insertMany(facturas);

// ---------- ÍNDICES ----------
db.facturas.createIndex({ fecha: 1 });
db.facturas.createIndex({ cliente_id: 1 });
db.facturas.createIndex({ tipo: 1, estado: 1 });

// ---------- VERIFICACIÓN ----------
print("Clientes:  " + db.clientes.countDocuments());
print("Terceros:  " + db.terceros.countDocuments());
print("Facturas:  " + db.facturas.countDocuments());
print("TOTAL DOCUMENTOS: " + (db.clientes.countDocuments() + db.terceros.countDocuments() + db.facturas.countDocuments()));
