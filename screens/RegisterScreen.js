
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import Toast from 'react-native-toast-message';
import { obtenerErrores } from '../utils/validaciones';

const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;
const soloTelefono = /^[0-9]{7,15}$/;

function validarFechaNacimiento(valor) {
  if (!valor.trim()) return 'La fecha de nacimiento es obligatoria.';

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = valor.match(regex);
  if (!match) return 'La fecha debe tener el formato DD/MM/AAAA.';

  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const anio = parseInt(match[3], 10);

  const anioActual = new Date().getFullYear();

  if (anio < 1900 || anio > anioActual)
    return `El año debe estar entre 1900 y ${anioActual}.`;
  if (mes < 1 || mes > 12)
    return 'El mes debe estar entre 01 y 12.';

  const diasEnMes = new Date(anio, mes, 0).getDate();
  if (dia < 1 || dia > diasEnMes)
    return `El día debe estar entre 01 y ${diasEnMes} para ese mes.`;

  const fechaIngresada = new Date(anio, mes - 1, dia);
  if (fechaIngresada > new Date())
    return 'La fecha de nacimiento no puede ser futura.';

  return null;
}

function validarCamposLocales({ nombres, apellidos, fechaNacimiento, telefono }) {
  const errores = [];

  if (!nombres.trim())
    errores.push('El nombre es obligatorio.');
  else if (!soloLetras.test(nombres))
    errores.push('El nombre solo puede contener letras.');
  else if (nombres.trim().length < 2)
    errores.push('El nombre debe tener al menos 2 caracteres.');

  if (!apellidos.trim())
    errores.push('El apellido es obligatorio.');
  else if (!soloLetras.test(apellidos))
    errores.push('El apellido solo puede contener letras.');
  else if (apellidos.trim().length < 2)
    errores.push('El apellido debe tener al menos 2 caracteres.');

  const errorFecha = validarFechaNacimiento(fechaNacimiento);
  if (errorFecha) errores.push(errorFecha);

  const telefonoLimpio = telefono.replace(/\s/g, '');
  if (!telefonoLimpio)
    errores.push('El teléfono es obligatorio.');
  else if (!soloTelefono.test(telefonoLimpio))
    errores.push('El teléfono debe tener entre 7 y 15 dígitos numéricos.');

  return errores;
}

function formatearFecha(texto, valorAnterior) {
  let soloDigitos = texto.replace(/\D/g, '');

  if (soloDigitos.length > 8) soloDigitos = soloDigitos.slice(0, 8);

  let resultado = soloDigitos;
  if (soloDigitos.length >= 3) {
    resultado = soloDigitos.slice(0, 2) + '/' + soloDigitos.slice(2);
  }
  if (soloDigitos.length >= 5) {
    resultado = soloDigitos.slice(0, 2) + '/' + soloDigitos.slice(2, 4) + '/' + soloDigitos.slice(4);
  }

  return resultado;
}

export default function RegisterScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const [cargando, setCargando] = useState(false);

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  useEffect(() => {
    const backAction = () => { if (cargando) return true; return false; };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [cargando]);

  const handleFechaNacimientoChange = (texto) => {
    const formateado = formatearFecha(texto, fechaNacimiento);
    setFechaNacimiento(formateado);
  };

  const mostrarError = (mensaje) => {
    Toast.show({
      type: 'error',
      text1: 'Error de validación',
      text2: mensaje,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const handleCrearCuenta = () => {
    const erroresLocales = validarCamposLocales({ nombres, apellidos, fechaNacimiento, telefono });
    if (erroresLocales.length > 0) {
      mostrarError(erroresLocales[0]);
      return;
    }

    const erroresUtils = obtenerErrores(correo, contrasena);
    if (erroresUtils.length > 0) {
      mostrarError(erroresUtils[0]);
      return;
    }

    if (confirmarContrasena !== contrasena) {
      mostrarError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      Toast.show({
        type: 'success',
        text1: 'Cuenta creada',
        text2: 'Tu cuenta ha sido creada exitosamente.',
        position: 'top',
        visibilityTime: 3000,
      });
      navigation.navigate('Login');
    }, 2000);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={styles.headerSection}>
              <Text style={styles.appTitle}>Cartilla Virtual</Text>
              <Text style={styles.appSubtitle}>Crea tu cuenta para comenzar</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.welcomeText}>¡Regístrate!</Text>
              <Text style={styles.subText}>Llena los datos para continuar</Text>

              <Text style={styles.label}>Nombres</Text>
              <TextInput
                style={styles.input}
                placeholder="Tus nombres"
                placeholderTextColor="#aaa"
                value={nombres}
                onChangeText={setNombres}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Apellidos</Text>
              <TextInput
                style={styles.input}
                placeholder="Tus apellidos"
                placeholderTextColor="#aaa"
                value={apellidos}
                onChangeText={setApellidos}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={fechaNacimiento}
                onChangeText={handleFechaNacimientoChange}
                maxLength={10}
              />

              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={setTelefono}
              />

              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
              />

              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Crea una contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={contrasena}
                onChangeText={setContrasena}
              />

              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
              />

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleCrearCuenta}
                disabled={cargando}
              >
                {cargando ? <ActivityIndicator color="white" /> : <Text style={styles.registerButtonText}>CREAR CUENTA</Text>}
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={cargando}>
                  <Text style={[styles.loginLink, cargando && { color: '#aaa' }]}>Inicia sesión</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSection: {
    backgroundColor: '#2E6B3E',
    paddingTop: 25,
    paddingBottom: 6,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 42,
    color: 'white',
    fontFamily: 'DancingScript_700Bold',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  formSection: {
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'DancingScript_700Bold',
    color: '#222',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#888',
    fontSize: 14,
  },
  loginLink: {
    color: '#2E6B3E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});


