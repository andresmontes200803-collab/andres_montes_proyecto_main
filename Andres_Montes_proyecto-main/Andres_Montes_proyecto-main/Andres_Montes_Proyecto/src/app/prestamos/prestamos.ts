import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Implemento {
  id: number;
  nombre: string;
  categoria: string;
  disponibles: number;
}

interface Prestamo {
  id: number;
  aprendiz: string;
  implementoId: number;
  implementoNombre: string;
  cantidad: number;
  estado: 'Prestado' | 'Devuelto';
}

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos {
  catalogo: Implemento[] = [
    { id: 1, nombre: 'Balón de fútbol', categoria: 'Deportes de equipo', disponibles: 3 },
    { id: 2, nombre: 'Balón de baloncesto', categoria: 'Deportes de equipo', disponibles: 2 },
    { id: 3, nombre: 'Raqueta de tenis', categoria: 'Deportes individuales', disponibles: 4 },
    { id: 4, nombre: 'Cuerda de salto', categoria: 'Acondicionamiento físico', disponibles: 5 }
  ];

  prestamos: Prestamo[] = [];
  private siguienteId = 1;

  nombreAprendiz = '';
  implementoSeleccionadoId: number | null = null;
  cantidadSolicitada: number | null = null;
  mensajeError = '';

  registrarPrestamo() {
    this.mensajeError = '';

    const nombreLimpio = this.nombreAprendiz.trim();
    if (!nombreLimpio) {
      this.mensajeError = 'Debes ingresar el nombre del aprendiz (no puede estar vacío).';
      return;
    }

    const implemento = this.catalogo.find(
      (item) => item.id === Number(this.implementoSeleccionadoId)
    );
    if (!implemento) {
      this.mensajeError = 'Debes seleccionar un implemento de la lista.';
      return;
    }

    const cantidad = Number(this.cantidadSolicitada);
    if (
      this.cantidadSolicitada === null ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0 ||
      cantidad > 2
    ) {
      this.mensajeError = 'La cantidad debe ser un número entero entre 1 y 2.';
      return;
    }

    if (cantidad > implemento.disponibles) {
      this.mensajeError = `Unidades insuficientes. Solo quedan ${implemento.disponibles} de ${implemento.nombre}.`;
      return;
    }

    implemento.disponibles -= cantidad;

    this.prestamos.push({
      id: this.siguienteId++,
      aprendiz: nombreLimpio,
      implementoId: implemento.id,
      implementoNombre: implemento.nombre,
      cantidad: cantidad,
      estado: 'Prestado'
    });

    this.nombreAprendiz = '';
    this.implementoSeleccionadoId = null;
    this.cantidadSolicitada = null;
  }

  registrarDevolucion(prestamoId: number) {
    const prestamo = this.prestamos.find((p) => p.id === prestamoId);
    if (!prestamo || prestamo.estado === 'Devuelto') {
      return;
    }

    prestamo.estado = 'Devuelto';

    const implemento = this.catalogo.find((i) => i.id === prestamo.implementoId);
    if (implemento) {
      implemento.disponibles += prestamo.cantidad;
    }
  }

  get totalPrestamos(): number {
    return this.prestamos.length;
  }

  get totalPendientes(): number {
    return this.prestamos.filter((p) => p.estado === 'Prestado').length;
  }

  get totalDevueltos(): number {
    return this.prestamos.filter((p) => p.estado === 'Devuelto').length;
  }
}