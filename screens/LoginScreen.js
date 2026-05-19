import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});

  if (!fontsLoaded) return null;

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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

          <View style={styles.imageSection}>
            <Image source={require('../assets/adulto-mayor.jpeg')} style={styles.bgImage} />
            <View style={styles.overlay} />
            <Text style={styles.appTitle}>Cartilla Virtual</Text>
            <Text style={styles.appSubtitle}>Lleva el control de tus vacunas fácilmente.</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <Text style={styles.subText}>Inicia sesión para continuar</Text>

            <TextInput
              style={[styles.input, errores.correo && styles.inputError]}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={(text) => { setCorreo(text); setErrores(e => ({ ...e, correo: null })); }}
            />
            {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

            <TextInput
              style={[styles.input, errores.contrasena && styles.inputError]}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={contrasena}
              onChangeText={(text) => { setContrasena(text); setErrores(e => ({ ...e, contrasena: null })); }}
            />
            {errores.contrasena && <Text style={styles.errorText}>{errores.contrasena}</Text>}

            <TouchableOpacity>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonHuella} onPress={handleHuella}>
              <Text style={styles.botonHuellaText}>Ingresar con huella dactilar</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  imageSection: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  appTitle: { fontSize: 42, color: 'white', fontFamily: 'DancingScript_700Bold', textAlign: 'center' },
  appSubtitle: { fontSize: 14, color: 'white', textAlign: 'center', marginTop: 8, paddingHorizontal: 30 },
  formSection: { flex: 3, paddingHorizontal: 30, paddingTop: 30 },
  welcomeText: { fontSize: 28, fontFamily: 'DancingScript_700Bold', color: '#222', marginBottom: 4 },
  subText: { fontSize: 14, color: '#888', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  forgotText: { textAlign: 'right', color: '#888', fontSize: 13, marginBottom: 24, marginTop: 4 },
  loginButton: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: '#888', fontSize: 14 },
  registerLink: { color: '#2E6B3E', fontWeight: 'bold', fontSize: 14 },

  botonHuella: {
    borderWidth: 2,
    borderColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  
  botonHuellaText: {
    color: '#2E6B3E',
    fontWeight: 'bold',
    fontSize: 15,
  },
});