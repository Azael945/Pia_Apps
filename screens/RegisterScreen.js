import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { obtenerErrores } from '../utils/validaciones';

export default function RegisterScreen({ navigation }) {
  const [cargando, setCargando] = useState(false);

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  useEffect(() => {
    const backAction = () => { if (cargando) return true; return false; };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [cargando]);

  const handleCrearCuenta = () => {
    const errores = obtenerErrores(correo, contrasena);

    if (confirmarContrasena !== contrasena) {
      errores.push('Las contraseñas no coinciden.');
    }

    if (errores.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Error de validación',
        text2: errores[0],
        position: 'top',
        visibilityTime: 3000,
      });
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerSub}>Crea tu cuenta</Text>
              <Text style={styles.headerTitle}>Cartilla Virtual</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              <Text style={styles.formTitle}>Regístrate</Text>
              <Text style={styles.formSub}>Llena los datos para continuar</Text>

              <Text style={styles.inputLabel}>NOMBRES</Text>
              <TextInput
                style={styles.input}
                placeholder="Tus nombres"
                placeholderTextColor="#bbb"
              />

              <Text style={styles.inputLabel}>APELLIDOS</Text>
              <TextInput
                style={styles.input}
                placeholder="Tus apellidos"
                placeholderTextColor="#bbb"
              />

              <Text style={styles.inputLabel}>FECHA DE NACIMIENTO</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>TELÉFONO</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                style={styles.input}
                placeholder="usuario@correo.com"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correo}
                onChangeText={setCorreo}
              />

              <Text style={styles.inputLabel}>CONTRASEÑA</Text>
              <TextInput
                style={styles.input}
                placeholder="Crea una contraseña"
                placeholderTextColor="#bbb"
                secureTextEntry
                value={contrasena}
                onChangeText={setContrasena}
              />

              <Text style={styles.inputLabel}>CONFIRMAR CONTRASEÑA</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#bbb"
                secureTextEntry
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
              />

              <TouchableOpacity
                style={[styles.btnPrimary, cargando && styles.btnDisabled]}
                onPress={handleCrearCuenta}
                disabled={cargando}
              >
                {cargando
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnPrimaryText}>Crear cuenta</Text>
                }
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  disabled={cargando}
                >
                  <Text style={[styles.loginLink, cargando && { color: '#aaa' }]}>
                    Inicia sesión
                  </Text>
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

  // Header
  header: {
    backgroundColor: '#2E6B3E',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.5,
  },

  // Formulario
  form: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 48,
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
    marginBottom: 28,
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
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#aaa',
    fontSize: 13,
  },
  loginLink: {
    color: '#2E6B3E',
    fontWeight: '600',
    fontSize: 13,
  },
});