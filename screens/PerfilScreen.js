
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';


const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const soloTelefono = /^[0-9]{7,15}$/;

function validarNombre(valor) {
  if (!valor.trim()) return 'El nombre es requerido.';
  if (valor.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  if (valor.trim().length > 80) return 'El nombre no puede superar los 80 caracteres.';
  if (!soloLetras.test(valor)) return 'El nombre solo puede contener letras.';
  return null;
}

function validarCorreo(valor) {
  if (!valor.trim()) return 'El correo es requerido.';
  if (!regexCorreo.test(valor.trim())) return 'Ingresa un correo válido.';
  return null;
}

function validarTelefono(valor) {
  const limpio = valor.replace(/\s/g, '');
  if (!limpio) return 'El teléfono es requerido.';
  if (!soloTelefono.test(limpio)) return 'El teléfono debe tener entre 7 y 15 dígitos numéricos.';
  return null;
}

function validarFechaNacimiento(valor) {
  if (!valor.trim()) return 'La fecha de nacimiento es requerida.';

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = valor.match(regex);
  if (!match) return 'Formato inválido. Usa DD/MM/AAAA.';

  const dia  = parseInt(match[1], 10);
  const mes  = parseInt(match[2], 10);
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

function formatearFecha(texto) {
  const soloDigitos = texto.replace(/\D/g, '').slice(0, 8);
  if (soloDigitos.length >= 5)
    return soloDigitos.slice(0, 2) + '/' + soloDigitos.slice(2, 4) + '/' + soloDigitos.slice(4);
  if (soloDigitos.length >= 3)
    return soloDigitos.slice(0, 2) + '/' + soloDigitos.slice(2);
  return soloDigitos;
}

export default function PerfilScreen({ navigation }) {
  const [perfil, setPerfil] = useState({
    nombre: 'Juan Pérez',
    correo: 'juan.perez@gmail.com',
    telefono: '8112345678',
    fechaNacimiento: '15/03/1958',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [errores, setErrores] = useState({});

  const [nombreTemp, setNombreTemp] = useState('');
  const [correoTemp, setCorreoTemp] = useState('');
  const [telefonoTemp, setTelefonoTemp] = useState('');
  const [fechaTemp, setFechaTemp] = useState('');

  const limpiarError = (campo) =>
    setErrores((e) => ({ ...e, [campo]: null }));

  const abrirModal = () => {
    setNombreTemp(perfil.nombre);
    setCorreoTemp(perfil.correo);
    setTelefonoTemp(perfil.telefono);
    setFechaTemp(perfil.fechaNacimiento);
    setErrores({});
    setModalVisible(true);
  };

  const handleFecha = (texto) => {
    setFechaTemp(formatearFecha(texto));
    limpiarError('fecha');
  };

  const handleGuardar = () => {
    const nuevosErrores = {
      nombre:   validarNombre(nombreTemp),
      correo:   validarCorreo(correoTemp),
      telefono: validarTelefono(telefonoTemp),
      fecha:    validarFechaNacimiento(fechaTemp),
    };

    const conError = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([, v]) => v !== null)
    );

    if (Object.keys(conError).length > 0) {
      setErrores(conError);
      return;
    }

    setPerfil({
      nombre:          nombreTemp.trim(),
      correo:          correoTemp.trim(),
      telefono:        telefonoTemp.trim(),
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
            <Text style={styles.filaLabel}>Nombre</Text>
            <Text style={styles.filaValor}>{perfil.nombre}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>Correo</Text>
            <Text style={styles.filaValor}>{perfil.correo}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>Teléfono</Text>
            <Text style={styles.filaValor}>{perfil.telefono}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>Nacimiento</Text>
            <Text style={styles.filaValor}>{perfil.fechaNacimiento}</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.botonEditar} onPress={abrirModal}>
            <Text style={styles.botonEditarText}>Editar perfil</Text>
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

              <Text style={styles.modalTitulo}>Editar Perfil</Text>
              <Text style={styles.modalSubtitulo}>Modifica tus datos personales</Text>

              {/* Nombre */}
              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Tu nombre completo"
                placeholderTextColor="#aaa"
                value={nombreTemp}
                onChangeText={(t) => { setNombreTemp(t); limpiarError('nombre'); }}
                autoCapitalize="words"
                maxLength={80}
              />
              {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

              {/* Correo */}
              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                style={[styles.input, errores.correo && styles.inputError]}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correoTemp}
                onChangeText={(t) => { setCorreoTemp(t); limpiarError('correo'); }}
              />
              {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

              {/* Teléfono */}
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={[styles.input, errores.telefono && styles.inputError]}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={telefonoTemp}
                onChangeText={(t) => { setTelefonoTemp(t); limpiarError('telefono'); }}
              />
              {errores.telefono && <Text style={styles.errorText}>{errores.telefono}</Text>}

              {/* Fecha */}
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

