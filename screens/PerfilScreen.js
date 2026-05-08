import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const datosMock = {
  nombre: 'Juan Pérez',
  correo: 'juan.perez@gmail.com',
  telefono: '81 1234 5678',
  fechaNacimiento: '15/03/1958',
};

export default function PerfilScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView>

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.tituloEmoji}>👤</Text>
          <Text style={styles.tituloSub}>TU CUENTA</Text>
          <Text style={styles.titulo}>Mi Perfil</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetra}>
              {datosMock.nombre.charAt(0)}
            </Text>
          </View>
          <Text style={styles.avatarNombre}>{datosMock.nombre}</Text>
          <Text style={styles.avatarCorreo}>{datosMock.correo}</Text>
        </View>

        {/* Datos */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Información personal</Text>

          <View style={styles.fila}>
            <Text style={styles.filaLabel}>📛 Nombre</Text>
            <Text style={styles.filaValor}>{datosMock.nombre}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>📧 Correo</Text>
            <Text style={styles.filaValor}>{datosMock.correo}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>📱 Teléfono</Text>
            <Text style={styles.filaValor}>{datosMock.telefono}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>🎂 Nacimiento</Text>
            <Text style={styles.filaValor}>{datosMock.fechaNacimiento}</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.botonEditar}>
            <Text style={styles.botonEditarText}>✏️ Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonCerrar}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.botonCerrarText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#2E6B3E',
    paddingTop: 5,
    paddingBottom: 6,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloEmoji: { fontSize: 36, marginBottom: 6 },
  tituloSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E6B3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarLetra: { fontSize: 36, color: 'white', fontWeight: 'bold' },
  avatarNombre: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  avatarCorreo: { fontSize: 13, color: '#888', marginTop: 2 },
  seccion: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E6B3E',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filaLabel: { fontSize: 14, color: '#555' },
  filaValor: { fontSize: 14, color: '#222', fontWeight: '600' },
  botonesContainer: { paddingHorizontal: 20, gap: 12, marginBottom: 40 },
  botonEditar: {
    borderWidth: 2,
    borderColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botonEditarText: { color: '#2E6B3E', fontWeight: 'bold', fontSize: 15 },
  botonCerrar: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botonCerrarText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 15 },
});