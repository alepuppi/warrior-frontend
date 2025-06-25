// components/RenovacionBuscarModal.jsx
import React, { useState, useEffect } from "react";
import "./renovacionBuscarModal.css";

const RenovacionBuscarModal = ({ cerrar, dniAuto = "" }) => {
  const [dni, setDni] = useState(dniAuto);
  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // 🔁 Ejecutar búsqueda automática si viene un dniAuto
  useEffect(() => {
    if (dniAuto) {
      buscarCliente(dniAuto);
    }
  }, [dniAuto]);

  const buscarCliente = async (dniBuscar = dni) => {
    if (!dniBuscar) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/${dniBuscar}`);
      const data = await response.json();

      if (response.ok) {
        setCliente(data);
        setMensaje("");
      } else {
        setCliente(null);
        setMensaje(data.message || "Cliente no encontrado");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al buscar el cliente");
    }
  };

  const calcularVencimiento = (fechaVencimiento) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < hoy;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Buscar Cliente</h2>

        <div className="form-group">
          <label>DNI:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresa el DNI"
          />
          <button onClick={() => buscarCliente()}>Buscar</button>
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        {cliente && (
          <div className="cliente-info">
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>DNI:</strong> {cliente.dni}</p>
            <p><strong>Fecha de matrícula:</strong> {new Date(cliente.fecha_matricula).toLocaleDateString()}</p>
            <p><strong>Fecha de vencimiento:</strong> {new Date(cliente.fecha_vencimiento).toLocaleDateString()}</p>
            {calcularVencimiento(cliente.fecha_vencimiento) && (
              <p className="alerta">⚠ La membresía está vencida</p>
            )}
          </div>
        )}

        <div className="modal-buttons">
          <button className="cancel" onClick={cerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default RenovacionBuscarModal;
