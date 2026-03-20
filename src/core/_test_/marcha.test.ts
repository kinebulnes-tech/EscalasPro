import { describe, it, expect } from 'vitest';
import { calcularEscala } from '../scaleEngine';
import { scales } from '../../data/scalesData';

describe('🛡️ Blindaje Clínico: Test de Marcha de 6 Minutos (6MWT)', () => {
  const marcha = scales.find(s => s.id === 'six_minute_walk');

  it('Debe calcular correctamente un hombre con capacidad conservada', () => {
    const respuestas = {
      sexo: 1,
      edad: 65,
      peso: 80,
      altura: 170,
      distancia: 450,
      fc_final: 110,    // ✅ Campo añadido
      spo2_final: 95,   // ✅ Campo añadido
      borg_disnea: 2,   // ✅ Campo añadido
      cronometro: 360   // ✅ Si el plugin envía el tiempo
    };

    const resultado = calcularEscala(marcha!, respuestas);

    expect(resultado.error).toBe(false);
    expect(resultado.puntaje).toBe(450);
    expect(resultado.interpretacion).toContain('CONSERVADA');
  });

  it('Debe disparar alerta si el paciente desatura (SpO2 <= 88%)', () => {
    const respuestas = {
      sexo: 2,
      edad: 60,
      peso: 70,
      altura: 155,
      distancia: 350,
      fc_final: 120,
      spo2_final: 85,   // 🚨 Desaturación
      borg_disnea: 5,
      cronometro: 360
    };

    const resultado = calcularEscala(marcha!, respuestas);

    expect(resultado.interpretacion).toContain('DESATURACIÓN');
    expect(resultado.detalleCompleto).toHaveProperty('color', 'orange-600');
  });
});