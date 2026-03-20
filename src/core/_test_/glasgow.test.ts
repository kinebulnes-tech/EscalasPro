import { describe, it, expect } from 'vitest';
import { calcularEscala } from '../scaleEngine';
import { scales } from '../../data/scalesData';

describe('🛡️ Blindaje Clínico: Escala de Glasgow', () => {
  // Localizamos la escala en tu catálogo por su ID
  const glasgow = scales.find(s => s.id === 'glasgow_emergencias');

  // TEST 1: El peor escenario posible
  it('Debe calcular correctamente el Coma Profundo (Mínimo: 3 pts)', () => {
    const respuestas = { ocular: 1, verbal: 1, motora: 1 };
    const resultado = calcularEscala(glasgow!, respuestas);
    
    expect(resultado.puntaje).toBe(3);
    expect(resultado.interpretacion).toContain('COMA');
    expect(resultado.error).toBe(false);
  });

  // TEST 2: Estado de normalidad
  it('Debe calcular correctamente un paciente Alerta (Máximo: 15 pts)', () => {
    const respuestas = { ocular: 4, verbal: 5, motora: 6 };
    const resultado = calcularEscala(glasgow!, respuestas);
    
    expect(resultado.puntaje).toBe(15);
    expect(resultado.interpretacion).toContain('Leve');
  });

  // TEST 3: El punto de corte crítico (Intubación)
  it('Debe identificar correctamente el umbral de intubación (≤ 8 pts)', () => {
    const respuestas = { ocular: 2, verbal: 2, motora: 4 }; // Total 8
    const resultado = calcularEscala(glasgow!, respuestas);
    
    expect(resultado.puntaje).toBe(8);
    expect(resultado.interpretacion).toContain('SEVERO');
  });

  // TEST 4: Seguridad ante errores del médico (Blindaje de datos)
  it('Seguridad: Debe bloquear el cálculo si faltan dimensiones', () => {
    const respuestas = { ocular: 4, verbal: 5 }; // Falta 'motora'
    const resultado = calcularEscala(glasgow!, respuestas);
    
    // Aquí verificamos que el motor devuelva null y no un puntaje falso
    expect(resultado.puntaje).toBeNull();
    expect(resultado.error).toBe(true);
    expect(resultado.interpretacion).toBe("Cálculo no disponible");
  });
});