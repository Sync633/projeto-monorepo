export interface UserInput {
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'aluno' | 'professor';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 *
 * Valida o formato de um endereço de e-mail
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 *
 * Vaida os requisitos de segurança de uma senha:
 * - Minímo de 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos um números
 */
export function isStrongPassword(password: string): boolean {
  if (!password || password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasNumber;
}

export function validateUserInput(input: Partial<UserInput>): ValidationResult {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < 3) {
    errors.push('O nome deve conter no mínimo 3 caracteres.');
  }

  if (!input.email || !isValidEmail(input.email)) {
    errors.push('O e-mail informado é inválido.');
  }

  if (input.password !== undefined && isStrongPassword(input.password)) {
    errors.push(
      'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e 1 número.',
    );
  }

  const validRoles = ['admin', 'aluno', 'professor'];
    if (input.role && !validRoles.includes(input.role)) {
        errors.push('O perfil de acesso informado é inválido.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}
