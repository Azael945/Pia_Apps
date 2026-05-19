import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const PARENTESCOS = ['Padre', 'Madre', 'Hijo', 'Hija', 'Abuelo', 'Abuela', 'Hermano', 'Hermana', 'Otro'];

export default function VacunasScreen({ navigation }) {
  const [personas, setPersonas] = useState([
    { id: '1', nombre: 'Yo', parentesco: 'Titular', fechaNacimiento: '' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [mostrarParentescos, setMostrarParentescos] = useState(false);
  const [errores, setErrores] = useState({});

  const handleFecha = (text) => {
    const n = text.replace(/\D/g, '');
    let f = n;
    if (n.length >= 3 && n.length <= 4) f = n.slice(0, 2) + '/' + n.slice(2);
    else if (n.length >= 5) f = n.slice(0, 2) + '/' + n.slice(2, 4) + '/' + n.slice(4, 8);
    setFechaNacimiento(f);
    setErrores(e => ({ ...e, fecha: null }));
  };

  const limpiar = () => {
    setNombre(''); setFechaNacimiento(''); setParentesco('');
    setErrores({}); setMostrarParentescos(false);
  };

  const handleAgregar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es requerido.';
    if (!fechaNacimiento || !/^\d{2}\/\d{2}\/\d{4}$/.test(fechaNacimiento)) e.fecha = 'Ingresa una fecha válida DD/MM/AAAA.';
    if (!parentesco) e.parentesco = 'Selecciona un parentesco.';
    if (Object.keys(e).length > 0) { setErrores(e); return; }

    setPersonas(prev => [...prev, {
      id: Date.now().toString(),
      nombre, fechaNacimiento, parentesco,
    }]);
    limpiar();
    setModalVisible(false);
  };

  const handleEliminar = (id) => {
    if (id === '1') return; // No eliminar "Yo"
    setPersonas(prev => prev.filter(p => p.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

      <View style={styles.headerSection}>
        <Text style={styles.tituloSub}>GESTIÓN FAMILIAR</Text>
        <Text style={styles.titulo}>Mis Cartillas 💉</Text>
      </View>

      <FlatList
        data={personas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CartillaDetalle', { nombre: item.nombre })}
          >
            <View style={styles.cardAvatar}>
              <Text style={styles.cardAvatarText}>
                {item.nombre.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNombre}>{item.nombre}</Text>
              <Text style={styles.cardParentesco}>{item.parentesco}</Text>
              {item.fechaNacimiento ? (
                <Text style={styles.cardFecha}>📅 {item.fechaNacimiento}</Text>
              ) : null}
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardFlecha}>›</Text>
              {item.id !== '1' && (
                <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                  <Text style={styles.botonEliminarText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { limpiar(); setModalVisible(true); }}>
        <Text style={styles.fabText}>+ Agregar persona</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => { limpiar(); setModalVisible(false); }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>Agregar persona</Text>
              <Text style={styles.modalSubtitulo}>Ingresa los datos del familiar</Text>

              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Nombre completo"
                placeholderTextColor="#aaa"
                value={nombre}
                onChangeText={t => { setNombre(t); setErrores(e => ({ ...e, nombre: null })); }}
              />
              {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

              <Text style={styles.label}>Fecha de nacimiento *</Text>
              <TextInput
                style={[styles.input, errores.fecha && styles.inputError]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={10}
                value={fechaNacimiento}
                onChangeText={handleFecha}
              />
              {errores.fecha && <Text style={styles.errorText}>{errores.fecha}</Text>}

              <Text style={styles.label}>Parentesco *</Text>
              <TouchableOpacity
                style={[styles.selector, errores.parentesco && styles.inputError]}
                onPress={() => setMostrarParentescos(!mostrarParentescos)}
              >
                <Text style={parentesco ? styles.selectorValor : styles.selectorPlaceholder}>
                  {parentesco || 'Selecciona el parentesco'}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              {mostrarParentescos && (
                <View style={styles.dropdown}>
                  {PARENTESCOS.map(p => (
                    <TouchableOpacity key={p} style={styles.dropdownItem}
                      onPress={() => { setParentesco(p); setMostrarParentescos(false); setErrores(e => ({ ...e, parentesco: null })); }}>
                      <Text style={styles.dropdownText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errores.parentesco && <Text style={styles.errorText}>{errores.parentesco}</Text>}

              <TouchableOpacity style={styles.botonAgregar} onPress={handleAgregar}>
                <Text style={styles.botonAgregarText}>AGREGAR PERSONA</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonCancelar} onPress={() => { limpiar(); setModalVisible(false); }}>
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
    backgroundColor: '#2E6B3E', paddingTop: 5, paddingBottom: 6,
    paddingHorizontal: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    alignItems: 'center', marginBottom: 16,
  },
  tituloSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  lista: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4,
  },
  cardAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#2E6B3E', justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  cardAvatarText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 2 },
  cardParentesco: { fontSize: 13, color: '#2E6B3E', fontWeight: '600', marginBottom: 2 },
  cardFecha: { fontSize: 12, color: '#888' },
  cardRight: { alignItems: 'center', gap: 8 },
  cardFlecha: { fontSize: 24, color: '#ccc', fontWeight: 'bold' },
  botonEliminarText: { fontSize: 16 },
  fab: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    backgroundColor: '#2E6B3E', paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 30, elevation: 5,
  },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 28, maxHeight: '90%' },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  modalSubtitulo: { fontSize: 13, color: '#888', marginBottom: 20 },
  label: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginBottom: 4, color: '#333',
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 12, marginBottom: 10, marginLeft: 4 },
  selector: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 4,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  selectorPlaceholder: { color: '#aaa', fontSize: 15 },
  selectorValor: { color: '#333', fontSize: 15 },
  dropdown: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    marginBottom: 4, overflow: 'hidden', backgroundColor: '#fff', elevation: 3,
  },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  dropdownText: { fontSize: 14, color: '#333' },
  botonAgregar: {
    backgroundColor: '#2E6B3E', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginBottom: 12, marginTop: 8,
  },
  botonAgregarText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  botonCancelar: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  botonCancelarText: { color: '#e74c3c', fontWeight: '600', fontSize: 15 },
});