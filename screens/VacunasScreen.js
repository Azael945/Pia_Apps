import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const vacunasIniciales = [
  { id: '1', nombre: 'COVID-19', fecha: '12/01/2022', dosis: 'Dosis 1', notas: '' },
  { id: '2', nombre: 'Influenza', fecha: '10/10/2023', dosis: 'Anual', notas: '' },
];

export default function VacunasScreen() {
  const [vacunas, setVacunas] = useState(vacunasIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [errores, setErrores] = useState({});

  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [dosis, setDosis] = useState('');
  const [notas, setNotas] = useState('');

  const limpiarFormulario = () => {
    setNombre('');
    setFecha('');
    setDosis('');
    setNotas('');
    setErrores({});
  };

  const handleAgregar = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre de la vacuna es requerido.';
    if (!fecha.trim()) {
      nuevosErrores.fecha = 'La fecha es requerida.';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      nuevosErrores.fecha = 'Formato inválido. Usa DD/MM/AAAA.';
    }
    if (!dosis.trim()) nuevosErrores.dosis = 'La dosis es requerida.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      fecha: fecha.trim(),
      dosis: dosis.trim(),
      notas: notas.trim(),
    };

    setVacunas((prev) => [nueva, ...prev]);
    limpiarFormulario();
    setModalVisible(false);
  };

  const handleFecha = (text) => {
  // Quita todo lo que no sea número
  const soloNumeros = text.replace(/\D/g, '');

  // Agrega los "/" automáticamente
  let formateado = soloNumeros;
  if (soloNumeros.length >= 3 && soloNumeros.length <= 4) {
    formateado = soloNumeros.slice(0, 2) + '/' + soloNumeros.slice(2);
  } else if (soloNumeros.length >= 5) {
    formateado = soloNumeros.slice(0, 2) + '/' + soloNumeros.slice(2, 4) + '/' + soloNumeros.slice(4, 8);
  }

  setFecha(formateado);
  setErrores(e => ({ ...e, fecha: null }));
};

const handleEliminar = (id) => {
  setVacunas((prev) => prev.filter((v) => v.id !== id));
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.tituloEmoji}>💉</Text>
        <Text style={styles.tituloSub}>TU HISTORIAL</Text>
        <Text style={styles.titulo}>Mis Vacunas</Text>
      </View>

      {/* Lista */}
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
                <Text style={styles.cardFecha}>📅 {item.fecha}</Text>
                {item.notas ? <Text style={styles.cardNotas}>📝 {item.notas}</Text> : null}
              </View>
              <View style={styles.cardRight}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Aplicada</Text>
                </View>
                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => handleEliminar(item.id)}
                >
                  <Text style={styles.botonEliminarText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Botón agregar */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+ Agregar vacuna</Text>
      </TouchableOpacity>

      {/* Modal formulario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { limpiarFormulario(); setModalVisible(false); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>

              <Text style={styles.modalTitulo}>💉 Nueva Vacuna</Text>
              <Text style={styles.modalSubtitulo}>Llena los datos de tu vacuna</Text>

              <Text style={styles.label}>Nombre de la vacuna *</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Ej: COVID-19, Influenza..."
                placeholderTextColor="#aaa"
                value={nombre}
                onChangeText={(t) => { setNombre(t); setErrores(e => ({ ...e, nombre: null })); }}
              />
              {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

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

              <Text style={styles.label}>Dosis *</Text>
              <TextInput
                style={[styles.input, errores.dosis && styles.inputError]}
                placeholder="Ej: Dosis 1, Refuerzo, Anual..."
                placeholderTextColor="#aaa"
                value={dosis}
                onChangeText={(t) => { setDosis(t); setErrores(e => ({ ...e, dosis: null })); }}
              />
              {errores.dosis && <Text style={styles.errorText}>{errores.dosis}</Text>}

              <Text style={styles.label}>Notas (opcional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Ej: Reacción leve, próxima dosis en 6 meses..."
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
                value={notas}
                onChangeText={setNotas}
              />

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

  // Modal
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
  inputMultiline: { height: 80, textAlignVertical: 'top', marginBottom: 14 },
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

  cardWrapper: {
  marginBottom: 12,
  },
  cardRight: {
    alignItems: 'center',
    gap: 8,
  },
  botonEliminar: {
    backgroundColor: '#fff0f0',
    borderRadius: 20,
    padding: 6,
  },
  botonEliminarText: {
    fontSize: 16,
  },
});