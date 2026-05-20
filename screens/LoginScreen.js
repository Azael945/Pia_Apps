import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});

  const handleLogin = () => {
    const nuevosErrores = {};

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido. Ej: usuario@mail.com';
    }
    if (contrasena.length < 8) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(contrasena)) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos una mayúscula.';
    } else if (!/[0-9]/.test(contrasena)) {
      nuevosErrores.contrasena = 'La contraseña debe tener al menos un número.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    navigation.navigate('MainTabs');
  };

  const handleHuella = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert('Error', 'Tu dispositivo no soporta autenticación biométrica.');
      return;
    }
    const registrado = await LocalAuthentication.isEnrolledAsync();
    if (!registrado) {
      Alert.alert('Error', 'No tienes huellas registradas en tu dispositivo.');
      return;
    }
    const resultado = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Usa tu huella para iniciar sesión',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar contraseña',
    });
    if (resultado.success) {
      navigation.navigate('MainTabs');
    } else {
      Alert.alert('Error', 'No se pudo verificar tu huella. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../assets/adulto-mayor.jpeg')}
              style={styles.headerImage}
            />
            <View style={styles.headerOverlay} />
            <View style={styles.headerContent}>
              <Text style={styles.headerSub}>Bienvenido</Text>
              <Text style={styles.headerTitle}>Cartilla Virtual</Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Inicia sesión</Text>
            <Text style={styles.formSub}>Ingresa tus datos para continuar</Text>

            {/* Correo */}
            <Text style={styles.inputLabel}>CORREO</Text>
            <TextInput
              style={[styles.input, errores.correo && styles.inputError]}
              placeholder="usuario@correo.com"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={t => { setCorreo(t); setErrores(e => ({ ...e, correo: null })); }}
            />
            {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

            {/* Contraseña */}
            <Text style={styles.inputLabel}>CONTRASEÑA</Text>
            <TextInput
              style={[styles.input, errores.contrasena && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              secureTextEntry
              value={contrasena}
              onChangeText={t => { setContrasena(t); setErrores(e => ({ ...e, contrasena: null })); }}
            />
            {errores.contrasena && <Text style={styles.errorText}>{errores.contrasena}</Text>}

            <TouchableOpacity>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
              <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnOutline} onPress={handleHuella}>
              <Text style={styles.btnOutlineText}>Huella dactilar</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Sin cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>

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

  // Header
  header: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  headerContent: {
    padding: 24,
    paddingBottom: 28,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.5,
  },

  // Formulario
  form: {
    flex: 3,
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  formSub: {
    fontSize: 13,
    color: '#999',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1.5,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#fafafa',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorText: {
    color: '#e53935',
    fontSize: 11,
    marginBottom: 12,
    marginLeft: 2,
  },
  forgotText: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
    marginTop: 6,
  },
  btnPrimary: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnOutlineText: {
    color: '#2E6B3E',
    fontSize: 15,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#aaa',
    fontSize: 13,
  },
  registerLink: {
    color: '#2E6B3E',
    fontWeight: '600',
    fontSize: 13,
  },
});