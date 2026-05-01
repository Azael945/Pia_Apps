import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

export default function LoginScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

          {/* Parte superior con imagen */}
          <View style={styles.imageSection}>
            <Image source={require('../assets/adulto-mayor.jpeg')} style={styles.bgImage} />
            <View style={styles.overlay} />
            <Text style={styles.appTitle}>Cartilla Virtual</Text>
            <Text style={styles.appSubtitle}>Lleva el control de tus vacunas fácilmente.</Text>
          </View>

          {/* Parte inferior con formulario */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <Text style={styles.subText}>Inicia sesión para continuar</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
            />

            <TouchableOpacity>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  appTitle: {
    fontSize: 42,
    color: 'white',
    fontFamily: 'DancingScript_700Bold',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 30,
  },
  formSection: {
    flex: 3,
    paddingHorizontal: 30,
    paddingTop: 30,
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
    marginBottom: 24,
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
  forgotText: {
    textAlign: 'right',
    color: '#888',
    fontSize: 13,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#888',
    fontSize: 14,
  },
  registerLink: {
    color: '#2E6B3E',
    fontWeight: 'bold',
    fontSize: 14,
  },
});