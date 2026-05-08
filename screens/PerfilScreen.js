import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function PerfilScreen({ navigation }) {
  const [perfil, setPerfil] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@gmail.com',
    telefono: '81 1234 5678',
    fechaNacimiento: '15/03/1958',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [errores, setErrores] = useState({});

  // Campos temporales mientras edita
  const [nombreTemp, setNombreTemp] = useState('');
  const [correoTemp, setCorreoTemp] = useState('');
  const [telefonoTemp, setTelefonoTemp] = useState('');
  const [fechaTemp, setFechaTemp] = useState('');

  const abrirModal = () => {
    // Carga los datos actuales en los campos del modal
    setNombreTemp(perfil.nombre);
    setCorreoTemp(perfil.correo);
    setTelefonoTemp(perfil.telefono);
    setFechaTemp(perfil.fechaNacimiento);
    setErrores({});
    setModalVisible(true);
  };

  const handleFecha = (text) => {
    const soloNumeros = text.replace(/\D/g, '');
    let formateado = soloNumeros;
    if (soloNumeros.length >= 3 && soloNumeros.length <= 4) {
      formateado = soloNumeros.slice(0, 2) + '/' + soloNumeros.slice(2);
    } else if (soloNumeros.length >= 5) {
      formateado = soloNumeros.slice(0, 2) + '/' + soloNumeros.slice(2, 4) + '/' + soloNumeros.slice(4, 8);
    }
    setFechaTemp(formateado);
    setErrores(e => ({ ...e, fecha: null }));
  };

  const handleGuardar = () => {
    const nuevosErrores = {};

    if (!nombreTemp.trim()) nuevosErrores.nombre = 'El nombre es requerido.';

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correoTemp)) nuevosErrores.correo = 'Ingresa un correo válido.';

    if (!telefonoTemp.trim()) nuevosErrores.telefono = 'El teléfono es requerido.';

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaTemp)) nuevosErrores.fecha = 'Formato inválido. Usa DD/MM/AAAA.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setPerfil({
      nombre: nombreTemp.trim(),
      correo: correoTemp.trim(),
      telefono: telefonoTemp.trim(),
      fechaNacimiento: fechaTemp.trim(),
    });

    setModalVisible(false);
  };

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
            <Text style={styles.avatarLetra}>{perfil.nombre.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.avatarNombre}>{perfil.nombre}</Text>
          <Text style={styles.avatarCorreo}>{perfil.correo}</Text>
        </View>

        {/* Datos */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Información personal</Text>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>📛 Nombre</Text>
            <Text style={styles.filaValor}>{perfil.nombre}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>📧 Correo</Text>
            <Text style={styles.filaValor}>{perfil.correo}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>📱 Teléfono</Text>
            <Text style={styles.filaValor}>{perfil.telefono}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>🎂 Nacimiento</Text>
            <Text style={styles.filaValor}>{perfil.fechaNacimiento}</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.botonEditar} onPress={abrirModal}>
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

      {/* Modal editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <Text style={styles.modalTitulo}>✏️ Editar Perfil</Text>
              <Text style={styles.modalSubtitulo}>Modifica tus datos personales</Text>

              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Tu nombre completo"
                placeholderTextColor="#aaa"
                value={nombreTemp}
                onChangeText={(t) => { setNombreTemp(t); setErrores(e => ({ ...e, nombre: null })); }}
              />
              {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                style={[styles.input, errores.correo && styles.inputError]}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correoTemp}
                onChangeText={(t) => { setCorreoTemp(t); setErrores(e => ({ ...e, correo: null })); }}
              />
              {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={[styles.input, errores.telefono && styles.inputError]}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={telefonoTemp}
                onChangeText={(t) => { setTelefonoTemp(t); setErrores(e => ({ ...e, telefono: null })); }}
              />
              {errores.telefono && <Text style={styles.errorText}>{errores.telefono}</Text>}

              <Text style={styles.label}>Fecha de nacimiento *</Text>
              <TextInput
                style={[styles.input, errores.fecha && styles.inputError]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={10}
                value={fechaTemp}
                onChangeText={handleFecha}
              />
              {errores.fecha && <Text style={styles.errorText}>{errores.fecha}</Text>}

              <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
                <Text style={styles.botonGuardarText}>GUARDAR CAMBIOS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botonCancelarText}>Cancelar</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 28,
    maxHeight: '85%',
  },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  modalSubtitulo: { fontSize: 13, color: '#888', marginBottom: 20 },
  label: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 5 },
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
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginBottom: 10, marginLeft: 4 },
  botonGuardar: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  botonGuardarText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  botonCancelar: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonCancelarText: { color: '#e74c3c', fontWeight: '600', fontSize: 15 },
});