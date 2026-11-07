import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Importamos el generador de QR real
import { buscarClientePorCI, procesarPagoPasarela, enviarWhatsAppConfirmacion } from '../services/api';
import './Ventas.css';

const atraccionesDB = [
  { atraccionId: 1, nombre: 'Trampoline Park', precio: 50, capacidadTurno: 30 },
  { atraccionId: 2, nombre: 'Bowling', precio: 40, capacidadTurno: 20 },
  { atraccionId: 3, nombre: 'Tirolesa', precio: 60, capacidadTurno: 15 },
  { atraccionId: 4, nombre: 'Láser Tag', precio: 45, capacidadTurno: 25 },
];

const Ventas = () => {
  const [paso, setPaso] = useState(1);
  const [ciCliente, setCiCliente] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', apellido: '', telefono: '', email: '' });
  
  const [modalidad, setModalidad] = useState('');
  const [atraccionSeleccionada, setAtraccionSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');
  
  // Estados de carga de las APIs
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [enviandoWhatsApp, setEnviandoWhatsApp] = useState(false);
  const [whatsappExitoso, setWhatsappExitoso] = useState(false);
  
  const [ventaExitosa, setVentaExitosa] = useState(null);

  // 1. BUSCAR CLIENTE (Usando API)
  const handleBuscarCliente = async (e) => {
    e.preventDefault();
    setBuscandoCliente(true);
    
    try {
      const res = await buscarClientePorCI(ciCliente);
      if (res.success) {
        setClienteEncontrado(res.cliente);
        setPaso(2); // Cliente existe, pasa a venta
      } else {
        setClienteEncontrado(null);
        setPaso(1.5); // Cliente no existe, pasa a registro
      }
    } catch (error) {
      alert("Error de conexión con la base de datos");
    } finally {
      setBuscandoCliente(false);
    }
  };

  const handleRegistrarCliente = (e) => {
    e.preventDefault();
    setClienteEncontrado({ ci: ciCliente, ...nuevoCliente });
    setPaso(2);
  };

  const handleSeleccionarAtraccion = (atraccion) => {
    setAtraccionSeleccionada(atraccion);
    setPaso(3);
  };

  // 2. PROCESAR PAGO Y GENERAR TICKET (Usando APIs externas)
  const handleProcesarPago = async () => {
    setProcesandoPago(true);
    
    try {
      // A. Llamamos a la Pasarela de Pagos (Solo si no es efectivo)
      let transaccion = null;
      if (metodoPago !== 'Efectivo') {
        transaccion = await procesarPagoPasarela(atraccionSeleccionada.precio, metodoPago);
      }

      // B. Si el pago es aprobado (o es efectivo), el sistema genera el ticket y el QR
      const nuevaVenta = {
        ventaId: Math.floor(Math.random() * 10000),
        cliente: clienteEncontrado,
        atraccion: atraccionSeleccionada,
        montoTotal: atraccionSeleccionada.precio,
        metodoPago: metodoPago,
        transaccionId: transaccion ? transaccion.transaccionId : 'EFECTIVO',
        // El código QR que se enviará (puede ser un JSON encriptado o un texto único)
        codigoQR: `XTREME|V:${Math.floor(Math.random() * 10000)}|CI:${clienteEncontrado.ci}|ATT:${atraccionSeleccionada.atraccionId}`,
        fecha: new Date().toLocaleString()
      };
      
      setVentaExitosa(nuevaVenta);
      setPaso(4); // Pantalla de éxito

      // C. Llamamos a la API de WhatsApp en segundo plano
      setEnviandoWhatsApp(true);
      await enviarWhatsAppConfirmacion(
        clienteEncontrado.telefono, 
        clienteEncontrado.nombre, 
        nuevaVenta.codigoQR, 
        atraccionSeleccionada.nombre
      );
      setWhatsappExitoso(true);
      
    } catch (error) {
      alert("Error en el pago: " + error.message);
    } finally {
      setProcesandoPago(false);
      setEnviandoWhatsApp(false);
    }
  };

  return (
    <div className="ventas-container">
      <h2 className="module-title">Módulo de Ventas y Cobro (Cajero)</h2>

      {/* PASO 1 */}
      {paso === 1 && (
        <div className="card">
          <h3>1. Buscar Cliente</h3>
          <form onSubmit={handleBuscarCliente} className="form-group">
            <label>Ingrese Carnet de Identidad (CI):</label>
            <div className="input-row">
              <input 
                type="text" 
                value={ciCliente} 
                onChange={(e) => setCiCliente(e.target.value)} 
                placeholder="Ej. 123456" 
                required 
                disabled={buscandoCliente}
              />
              <button type="submit" className="btn-yellow" disabled={buscandoCliente}>
                {buscandoCliente ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <small>Prueba con: 123456 (Cliente existente) o cualquier otro (Nuevo)</small>
          </form>
        </div>
      )}

      {/* PASO 1.5 */}
      {paso === 1.5 && (
        <div className="card">
          <h3>Registrar Nuevo Cliente (CRM)</h3>
          <p>El CI <strong>{ciCliente}</strong> no está registrado. Complete los datos:</p>
          <form onSubmit={handleRegistrarCliente} className="form-grid">
            <input type="text" placeholder="Nombre" onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})} required />
            <input type="text" placeholder="Apellido" onChange={(e) => setNuevoCliente({...nuevoCliente, apellido: e.target.value})} required />
            <input type="text" placeholder="Teléfono (WhatsApp con +591)" onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})} required />
            <input type="email" placeholder="Email" onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})} required />
            <button type="submit" className="btn-yellow">Registrar y Continuar</button>
          </form>
        </div>
      )}

      {/* PASO 2 */}
      {paso === 2 && (
        <div className="card">
          <h3>2. Venta para: {clienteEncontrado.nombre} {clienteEncontrado.apellido}</h3>
          
          <div className="modality-section">
            <label>Seleccionar "Modalidad Fecha":</label>
            <div className="radio-group">
              <label><input type="radio" name="modalidad" value="Uso Inmediato" onChange={(e) => setModalidad(e.target.value)} /> Uso Inmediato (En el día)</label>
              <label><input type="radio" name="modalidad" value="Reserva Anticipada" onChange={(e) => setModalidad(e.target.value)} /> Reserva Anticipada</label>
            </div>
          </div>

          {modalidad && (
            <div className="attractions-section">
              <label>Seleccionar Atracción o Paquete:</label>
              <div className="attractions-grid">
                {atraccionesDB.map(att => (
                  <div key={att.atraccionId} className="attraction-card" onClick={() => handleSeleccionarAtraccion(att)}>
                    <h4>{att.nombre}</h4>
                    <p>Bs. {att.precio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PASO 3 */}
      {paso === 3 && (
        <div className="card">
          <h3>3. Resumen y Pago</h3>
          <div className="summary">
            <p><strong>Atracción:</strong> {atraccionSeleccionada.nombre}</p>
            <p><strong>Modalidad:</strong> {modalidad}</p>
            <p className="total">Total a Cobrar: Bs. {atraccionSeleccionada.precio}</p>
          </div>

          <div className="payment-methods">
            <label>Seleccionar Método de Pago:</label>
            <div className="payment-options">
              <button onClick={() => setMetodoPago('Efectivo')} className={metodoPago === 'Efectivo' ? 'active' : ''}>Efectivo</button>
              <button onClick={() => setMetodoPago('QR Simple')} className={metodoPago === 'QR Simple' ? 'active' : ''}>QR Simple</button>
              <button onClick={() => setMetodoPago('Tarjeta')} className={metodoPago === 'Tarjeta' ? 'active' : ''}>Tarjeta</button>
            </div>
          </div>

          {metodoPago && (
            <div className="action-area">
              {metodoPago !== 'Efectivo' && (
                <p className="api-notice">🔌 Conectando con Pasarela de Pagos...</p>
              )}
              <button 
                className="btn-yellow btn-large" 
                onClick={handleProcesarPago}
                disabled={procesandoPago}
              >
                {procesandoPago ? 'Procesando Transacción...' : 'Confirmar y Generar Ticket'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* PASO 4 */}
      {paso === 4 && (
        <div className="card success-card">
          <h3>✅ ¡Venta Exitosa!</h3>
          <div className="ticket-receipt">
            <p><strong>Código de Venta:</strong> #{ventaExitosa.ventaId}</p>
            <p><strong>Transacción:</strong> {ventaExitosa.transaccionId}</p>
            <p><strong>Cliente:</strong> {ventaExitosa.cliente.nombre}</p>
            <p><strong>Atracción:</strong> {ventaExitosa.atraccion.nombre}</p>
            <p><strong>Monto:</strong> Bs. {ventaExitosa.montoTotal}</p>
            
            <div className="qr-container">
              {/* Generador de QR Real */}
              <QRCodeSVG value={ventaExitosa.codigoQR} size={180} />
              <p>Código QR de acceso generado</p>
            </div>

            <div className="whatsapp-status">
              {enviandoWhatsApp ? (
                <p>📱 Enviando confirmación por WhatsApp API...</p>
              ) : whatsappExitoso ? (
                <p className="success-text">✅ Confirmación enviada a {ventaExitosa.cliente.telefono} vía WhatsApp API</p>
              ) : null}
            </div>
          </div>
          <button className="btn-yellow" onClick={() => window.location.reload()}>Nueva Venta</button>
        </div>
      )}
    </div>
  );
};

export default Ventas;