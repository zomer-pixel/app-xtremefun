import React, { useState } from 'react';
import { validarAccesoAtraccion } from '../services/api';
import './ControlAcceso.css';

const ControlAcceso = () => {
  const [codigoQR, setCodigoQR] = useState('');
  const [atraccionId, setAtraccionId] = useState('1');
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleValidar = async (e) => {
    e.preventDefault();
    setValidando(true);
    setResultado(null);
    setError(null);

    try {
      const res = await validarAccesoAtraccion(codigoQR, parseInt(atraccionId));
      setResultado(res);
      setCodigoQR(''); // Limpiar para el siguiente
    } catch (err) {
      setError(err.message);
    } finally {
      setValidando(false);
    }
  };

  return (
    <div className="control-container">
      <h2 className="module-title">Control de Acceso (Operador)</h2>
      
      <div className="card">
        <form onSubmit={handleValidar} className="form-group">
          <div className="input-group">
            <label>Escanear / Ingresar Código QR del Ticket:</label>
            <input 
              type="text" 
              value={codigoQR} 
              onChange={(e) => setCodigoQR(e.target.value)} 
              placeholder="Ej. XTREME|V:1234..." 
              required 
              autoFocus
            />
          </div>
          
          <div className="input-group">
            <label>Atracción a Validar:</label>
            <select value={atraccionId} onChange={(e) => setAtraccionId(e.target.value)}>
              <option value="1">Trampoline Park</option>
              <option value="2">Bowling</option>
              <option value="3">Tirolesa (Llena para probar)</option>
              <option value="4">Láser Tag</option>
            </select>
          </div>

          <button type="submit" className="btn-yellow btn-large" disabled={validando}>
            {validando ? 'Validando en Base de Datos...' : 'Validar Ingreso'}
          </button>
        </form>
      </div>

      {/* Pantalla de Resultado */}
      {resultado && (
        <div className="card success-card mt-20">
          <h3 style={{ color: '#008A3E' }}>✅ Acceso Permitido</h3>
          <p>{resultado.mensaje}</p>
          <div className="ticket-info">
            <p><strong>Pulsera Asignada:</strong> {resultado.pulsera}</p>
            <p><strong>Hora de Ingreso:</strong> {resultado.horaIngreso}</p>
          </div>
          <button className="btn-yellow mt-20" onClick={() => setResultado(null)}>Siguiente Cliente</button>
        </div>
      )}

      {/* Pantalla de Error (Capacidad llena o QR inválido) */}
      {error && (
        <div className="card error-card mt-20">
          <h3>❌ Acceso Denegado</h3>
          <p>{error}</p>
          <button className="btn-yellow mt-20" style={{ backgroundColor: '#E3000F', color: 'white' }} onClick={() => setError(null)}>Entendido</button>
        </div>
      )}
    </div>
  );
};

export default ControlAcceso;