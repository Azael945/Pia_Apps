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
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const anio = parseInt(match[3], 10);
  const anioActual = new Date().getFullYear();
  if (anio < 1900 || anio > anioActual) return `El año debe estar entre 1900 y ${anioActual}.`;
  if (mes < 1 || mes > 12) return 'El mes debe estar entre 01 y 12.';
  const diasEnMes = new Date(anio, mes, 0).getDate();
  if (dia < 1 || dia > diasEnMes) return `El día debe estar entre 01 y ${diasEnMes}.`;
  const fechaIngresada = new Date(anio, mes - 1, dia);
  if (fechaIngresada > new Date()) return 'La fecha no puede ser futura.';
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

  const limpiarError = (campo) => setErrores(e => ({ ...e, [campo]: null }));

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
      nombre: validarNombre(nombreTemp),
      correo: validarCorreo(correoTemp),
      telefono: validarTelefono(telefonoTemp),
      fecha: validarFechaNacimiento(fechaTemp),
    };
    const conError = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([, v]) => v !== null)
    );
    if (Object.keys(conError).length > 0) { setErrores(conError); return; }
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

        {/* Header con avatar integrado */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerSub}>Tu cuenta</Text>
              <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetra}>
                {perfil.nombre.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.headerNombre}>{perfil.nombre}</Text>
          <Text style={styles.headerCorreo}>{perfil.correo}</Text>
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
            <Text style={styles.filaValor} numberOfLines={1}>{perfil.correo}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.filaLabel}>Teléfono</Text>
            <Text style={styles.filaValor}>{perfil.telefono}</Text>
          </View>
          <View style={[styles.fila, { borderBottomWidth: 0 }]}>
            <Text style={styles.filaLabel}>Nacimiento</Text>
            <Text style={styles.filaValor}>{perfil.fechaNacimiento}</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.botonesContainer}>
          <TouchableOpacity style={styles.btnEditar} onPress={abrirModal}>
            <Text style={styles.btnEditarText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCerrar}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btnCerrarText}>Cerrar sesión</Text>
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

              <Text style={styles.inputLabel}>NOMBRE COMPLETO</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Tu nombre completo"
                placeholderTextColor="#bbb"
                value={nombreTemp}
                onChangeText={t => { setNombreTemp(t); limpiarError('nombre'); }}
                autoCapitalize="words"
                maxLength={80}
              />
              {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                style={[styles.input, errores.correo && styles.inputError]}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
                value={correoTemp}
                onChangeText={t => { setCorreoTemp(t); limpiarError('correo'); }}
              />
              {errores.correo && <Text style={styles.errorText}>{errores.correo}</Text>}

              <Text style={styles.inputLabel}>TELÉFONO</Text>
              <TextInput
                style={[styles.input, errores.telefono && styles.inputError]}
                placeholder="Tu número de teléfono"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
                value={telefonoTemp}
                onChangeText={t => { setTelefonoTemp(t); limpiarError('telefono'); }}
              />
              {errores.telefono && <Text style={styles.errorText}>{errores.telefono}</Text>}

              <Text style={styles.inputLabel}>FECHA DE NACIMIENTO</Text>
              <TextInput
                style={[styles.input, errores.fecha && styles.inputError]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#bbb"
                keyboardType="numeric"
                maxLength={10}
                value={fechaTemp}
                onChangeText={handleFecha}
              />
              {errores.fecha && <Text style={styles.errorText}>{errores.fecha}</Text>}

              <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
                <Text style={styles.btnGuardarText}>Guardar cambios</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: '#2E6B3E',
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetra: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  headerNombre: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 2,
  },
  headerCorreo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // Sección datos
  seccion: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  seccionTitulo: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E6B3E',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  filaLabel: { fontSize: 13, color: '#999' },
  filaValor: { fontSize: 13, color: '#111', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },

  // Botones
  botonesContainer: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 40,
  },
  btnEditar: {
    borderWidth: 1.5,
    borderColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnEditarText: {
    color: '#2E6B3E',
    fontWeight: '600',
    fontSize: 15,
  },
  btnCerrar: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnCerrarText: {
    color: '#e53935',
    fontWeight: '600',
    fontSize: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    maxHeight: '88%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  modalSubtitulo: {
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
  inputError: { borderColor: '#e53935' },
  errorText: {
    color: '#e53935',
    fontSize: 11,
    marginBottom: 12,
    marginLeft: 2,
  },
  btnGuardar: {
    backgroundColor: '#2E6B3E',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  btnGuardarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  btnCancelar: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnCancelarText: {
    color: '#e53935',
    fontWeight: '600',
    fontSize: 14,
  },
});