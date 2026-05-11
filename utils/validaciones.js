export function obtenerErrores(correo, contrasena) {
  const errores = [];

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    errores.push('El correo no tiene un formato válido.');
  }

  if (contrasena.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }
  if (!/[A-Z]/.test(contrasena)) {
    errores.push('La contraseña debe tener al menos una mayúscula.');
  }
  if (!/[0-9]/.test(contrasena)) {
    errores.push('La contraseña debe tener al menos un número.');
  }

  return errores;
}