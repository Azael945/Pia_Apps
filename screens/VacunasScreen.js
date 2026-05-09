
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const vacunasIniciales = [
  { id: '1', nombre: 'COVID-19', fecha: '12/01/2022', dosis: 'Dosis 1', notas: '' },
  { id: '2', nombre: 'Influenza', fecha: '10/10/2023', dosis: 'Anual', notas: '' },
];

const soloLetrasNumeros = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñÜü\s\-().]+$/;

function validarFecha(valor) {
  if (!valor.trim()) return 'La fecha es requerida.';

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
    return 'La fecha de aplicación no puede ser futura.';

  return null;
}

function validarNombre(valor) {
  if (!valor.trim()) return 'El nombre de la vacuna es requerido.';
  if (valor.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  if (valor.trim().length > 60) return 'El nombre no puede superar los 60 caracteres.';
  if (!soloLetrasNumeros.test(valor))
    return 'El nombre solo puede contener letras, números y guiones.';
  return null;
}

function validarDosis(valor) {
  if (!valor.trim()) return 'La dosis es requerida.';
  if (valor.trim().length < 2) return 'La dosis debe tener al menos 2 caracteres.';
  if (valor.trim().length > 40) return 'La dosis no puede superar los 40 caracteres.';
  if (!soloLetrasNumeros.test(valor))
    return 'La dosis solo puede contener letras, números y guiones.';
  return null;
}

function validarNotas(valor) {
  if (valor.trim().length > 200)
    return 'Las notas no pueden superar los 200 caracteres.';
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

export default function VacunasScreen() {
  const [vacunas, setVacunas] = useState(vacunasIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [errores, setErrores] = useState({});

  const [nombre, setNombre] = useState('');
  const [fecha,  setFecha]  = useState('');
  const [dosis,  setDosis]  = useState('');
  const [notas,  setNotas]  = useState('');

  const limpiarError = (campo) =>
    setErrores((e) => ({ ...e, [campo]: null }));

  const limpiarFormulario = () => {
    setNombre('');
    setFecha('');
    setDosis('');
    setNotas('');
    setErrores({});
  };

  const handleFecha = (texto) => {
    setFecha(formatearFecha(texto));
    limpiarError('fecha');
  };

  const handleAgregar = () => {
    const nuevosErrores = {
      nombre: validarNombre(nombre),
      fecha:  validarFecha(fecha),
      dosis:  validarDosis(dosis),
      notas:  validarNotas(notas),
    };

    const conError = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([, v]) => v !== null)
    );

    if (Object.keys(conError).length > 0) {
      setErrores(conError);
      return;
    }

    const nueva = {
      id:     Date.now().toString(),
      nombre: nombre.trim(),
      fecha:  fecha.trim(),
      dosis:  dosis.trim(),
      notas:  notas.trim(),
    };

    setVacunas((prev) => [nueva, ...prev]);
    limpiarFormulario();
    setModalVisible(false);
  };

  const handleEliminar = (id) =>
    setVacunas((prev) => prev.filter((v) => v.id !== id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

      <View style={styles.headerSection}>
        <Text style={styles.tituloEmoji}>💉</Text>
        <Text style={styles.tituloSub}>TU HISTORIAL</Text>
        <Text style={styles.titulo}>Mis Vacunas</Text>
      </View>

      <FlatList
        data={vacunas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes vacunas registradas aún.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardNombre}>{item.nombre}</Text>
                <Text style={styles.cardDosis}>{item.dosis}</Text>
                <Text style={styles.cardFecha}>{item.fecha}</Text>
                {item.notas ? <Text style={styles.cardNotas}>{item.notas}</Text> : null}
              </View>
              <View style={styles.cardRight}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Aplicada</Text>
                </View>
                <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminar(item.id)}>
                  <Text style={styles.botonEliminarText}></Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+ Agregar vacuna</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { limpiarFormulario(); setModalVisible(false); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <Text style={styles.modalTitulo}>Nueva Vacuna</Text>
              <Text style={styles.modalSubtitulo}>Llena los datos de tu vacuna</Text>

              {/* Nombre */}
              <Text style={styles.label}>Nombre de la vacuna *</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Ej: COVID-19, Influenza..."
                placeholderTextColor="#aaa"
                value={nombre}
                onChangeText={(t) => { setNombre(t); limpiarError('nombre'); }}
                maxLength={60}
              />
              {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

              {/* Fecha */}
              <Text style={styles.label}>Fecha de aplicación *</Text>
              <TextInput
                style={[styles.input, errores.fecha && styles.inputError]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={10}
                value={fecha}
                onChangeText={handleFecha}
              />
              {errores.fecha && <Text style={styles.errorText}>{errores.fecha}</Text>}

              {/* Dosis */}
              <Text style={styles.label}>Dosis *</Text>
              <TextInput
                style={[styles.input, errores.dosis && styles.inputError]}
                placeholder="Ej: Dosis 1, Refuerzo, Anual..."
                placeholderTextColor="#aaa"
                value={dosis}
                onChangeText={(t) => { setDosis(t); limpiarError('dosis'); }}
                maxLength={40}
              />
              {errores.dosis && <Text style={styles.errorText}>{errores.dosis}</Text>}

              {/* Notas */}
              <Text style={styles.label}>Notas (opcional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline, errores.notas && styles.inputError]}
                placeholder="Ej: Reacción leve, próxima dosis en 6 meses..."
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
                value={notas}
                onChangeText={(t) => { setNotas(t); limpiarError('notas'); }}
                maxLength={200}
              />
              <Text style={styles.contador}>{notas.length}/200</Text>
              {errores.notas && <Text style={styles.errorText}>{errores.notas}</Text>}

              <TouchableOpacity style={styles.botonGuardar} onPress={handleAgregar}>
                <Text style={styles.botonGuardarText}>GUARDAR VACUNA</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => { limpiarFormulario(); setModalVisible(false); }}
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
  lista: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#aaa', fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardLeft: { flex: 1 },
  cardNombre: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  cardDosis: { fontSize: 13, color: '#555', marginBottom: 4 },
  cardFecha: { fontSize: 12, color: '#888' },
  cardNotas: { fontSize: 12, color: '#aaa', marginTop: 4 },
  badge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#2E6B3E' },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#2E6B3E',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
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
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  errorText: { color: '#e74c3c', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  contador: { fontSize: 11, color: '#bbb', textAlign: 'right', marginBottom: 10 },
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
  cardWrapper: { marginBottom: 12 },
  cardRight: { alignItems: 'center', gap: 8 },
  botonEliminar: { backgroundColor: '#fff0f0', borderRadius: 20, padding: 6 },
  botonEliminarText: { fontSize: 16 },
});

