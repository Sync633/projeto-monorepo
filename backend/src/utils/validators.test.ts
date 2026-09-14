import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isStrongPassword,
  //   validateUserInput,
  //   UserInput,
} from './validators';

describe('Módulo de Validação: validators.ts', () => {
  describe('Função isValidEmail', () => {
    it('Deve retornar true para um endereço de e-mail válido AAA (Arrange, Act, Assert)', () => {
      // onde realmente ocorre o teste
      // 1. Arrange (Preparar)
      const validEmail = 'aluno.fatec@sp.gov.br';

      // 2. Act (Agir)
      const result = isValidEmail(validEmail);

      // 3. Assert (Afirmar)
      expect(result).toBe(true);
    });

    it('Deve retornar false para emails com formato inválido', () => {
      // Arrange & Act
      expect(isValidEmail('usuario_sem_arroba.com')).toBe(false);
      expect(isValidEmail('usuario@dominio')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Funçã isStrongPassword', () => {
    it('Deve aceitar uma senha com 8 caracteres, maiusculas e número', () => {
      // Arrage
      const strongPassword = 'Password123';

      // Act
      const result = isStrongPassword(strongPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('Deve rejeitar senhas com menos de 8 caracteres', () => {
      const shortPassword = 'Pass1';
      const result = isStrongPassword(shortPassword);
      expect(result).toBe(false);
    });

    it('Deve rejeitar senhas sem letras maiusculas', () => {
      const noUpperPassword = 'password123';
      const result = isStrongPassword(noUpperPassword);
      expect(result).toBe(false);
    });

    it('Deve rejeitar senhas sem números', () => {
      const noNumberPassword = 'Pass1';
      const result = isStrongPassword(noNumberPassword);
      expect(result).toBe(false);
    });
  });
});
