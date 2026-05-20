import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const VACUNAS_OFICIALES = [
  'Toxoide Tetánico Diftérico (Td)',
  'Antineumocócica (Neumococo)',
  'Influenza',
  'COVID-19',
  'Hepatitis B',
  'Sarampión-Rubéola (SR)',
];

const INSTITUCIONES = ['IMSS', 'ISSSTE', 'Secretaría de Salud', 'IMSS Bienestar', 'Sector Privado'];

const generarFolio = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `VAC-2026-${num}`;
};

function FakeQR() {
  const celdas = Array(7).fill(null);
  return (
    <View style={qrStyles.qr}>
      {celdas.map((_, fila) => (
        <View key={fila} style={qrStyles.fila}>
          {celdas.map((_, col) => {
            const esEsquina = (fila < 2 && col < 2) || (fila < 2 && col > 4) || (fila > 4 && col < 2);
            const aleatorio = (fila * 7 + col * 3) % 2 === 0;
            return (
              <View key={col} style={[qrStyles.celda, (esEsquina || aleatorio) && qrStyles.celdaOscura]} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const qrStyles = StyleSheet.create({
  qr: { padding: 8, backgroundColor: 'white', borderRadius: 8 },
  fila: { flexDirection: 'row' },
  celda: { width: 10, height: 10, margin: 1, backgroundColor: 'transparent' },
  celdaOscura: { backgroundColor: '#1a1a1a' },
});

export default function CartillaDetalleScreen({ route, navigation }) {
  const { nombre } = route.params ?? { nombre: 'Sin nombre' };

  const [vacunas, setVacunas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paso, setPaso] = useState(1);
  const [errores, setErrores] = useState({});
  const [folioGenerado, setFolioGenerado] = useState('');
  const [vacunaSeleccionada, setVacunaSeleccionada] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);

  const [nombreVacuna, setNombreVacuna] = useState('');
  const [fecha, setFecha] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [lote, setLote] = useState('');
  const [dosis, setDosis] = useState('');
  const [mostrarVacunas, setMostrarVacunas] = useState(false);
  const [mostrarInstituciones, setMostrarInstituciones] = useState(false);

  const limpiar = () => {
    setNombreVacuna(''); setFecha(''); setInstitucion('');
    setLote(''); setDosis('');
    setErrores({}); setPaso(1); setFolioGenerado('');
    setMostrarVacunas(false); setMostrarInstituciones(false);
  };

  const handleFecha = (text) => {
    const n = text.replace(/\D/g, '');
    let f = n;
    if (n.length >= 3 && n.length <= 4) f = n.slice(0, 2) + '/' + n.slice(2);
    else if (n.length >= 5) f = n.slice(0, 2) + '/' + n.slice(2, 4) + '/' + n.slice(4, 8);
    setFecha(f);
    setErrores(e => ({ ...e, fecha: null }));
  };

  const handleValidar = () => {
    const e = {};
    if (!nombreVacuna) e.nombre = 'Selecciona una vacuna.';
    if (!fecha || !/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) e.fecha = 'Ingresa una fecha válida DD/MM/AAAA.';
    if (!institucion) e.institucion = 'Selecciona una institución.';
    if (!lote.trim()) e.lote = 'El número de lote es requerido.';
    if (!dosis.trim()) e.dosis = 'La dosis es requerida.';
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setPaso(2);
    setFolioGenerado(generarFolio());
    setTimeout(() => setPaso(3), 2500);
  };

  const handleGuardar = () => {
    setVacunas(prev => [{
      id: Date.now().toString(),
      nombre: nombreVacuna, fecha, dosis, institucion, lote,
      folio: folioGenerado,
    }, ...prev]);
    limpiar();
    setModalVisible(false);
  };

  const handleEliminar = (id) => setVacunas(prev => prev.filter(v => v.id !== id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

      <View style={styles.headerSection}>
        <Text style={styles.tituloSub}>CARTILLA DE</Text>
        <Text style={styles.titulo}>{nombre}</Text>
      </View>

      <FlatList
        data={vacunas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay vacunas registradas aún.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { setVacunaSeleccionada(item); setDetalleVisible(true); }}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardNombre}>{item.nombre}</Text>
              <Text style={styles.cardDosis}>{item.dosis}</Text>
              <Text style={styles.cardFecha}>📅 {item.fecha}</Text>
              <Text style={styles.cardFolio}>🏷️ {item.folio}</Text>
              <Text style={styles.cardInstitucion}>🏥 {item.institucion}</Text>
            </View>
            <View style={styles.cardRight}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Validada</Text>
              </View>
              <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminar(item.id)}>
                <Text style={styles.botonEliminarText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => { limpiar(); setModalVisible(true); }}>
        <Text style={styles.fabText}>+ Registrar vacuna</Text>
      </TouchableOpacity>

      {/* Modal Detalle */}
      <Modal visible={detalleVisible} animationType="slide" transparent onRequestClose={() => setDetalleVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {vacunaSeleccionada && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.certificadoHeader}>
                  <Text style={styles.certificadoTitulo}>Certificado Oficial</Text>
                  <Text style={styles.certificadoSub}>Detalle de vacuna registrada</Text>
                </View>
                <View style={styles.certificadoCard}>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoText}>ESTADO: VALIDADA</Text>
                  </View>
                  {[
                    ['Folio', vacunaSeleccionada.folio],
                    ['Vacuna', vacunaSeleccionada.nombre],
                    ['Institución', vacunaSeleccionada.institucion],
                    ['Fecha', vacunaSeleccionada.fecha],
                    ['Dosis', vacunaSeleccionada.dosis],
                    ['Lote', vacunaSeleccionada.lote],
                  ].map(([label, valor]) => (
                    <View key={label} style={styles.certificadoFila}>
                      <Text style={styles.certificadoLabel}>{label}</Text>
                      <Text style={styles.certificadoValor}>{valor}</Text>
                    </View>
                  ))}
                  <View style={styles.qrContainer}>
                    <FakeQR />
                    <Text style={styles.qrLabel}>Código de verificación oficial</Text>
                    <Text style={styles.qrSub}>SSA-MX · {vacunaSeleccionada.folio}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.botonCancelar} onPress={() => setDetalleVisible(false)}>
                  <Text style={styles.botonCancelarText}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Registrar */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => { if (paso !== 2) { limpiar(); setModalVisible(false); } }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {paso === 1 && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitulo}>Registrar Vacuna</Text>
                <Text style={styles.modalSubtitulo}>Ingresa los datos oficiales</Text>

                <Text style={styles.label}>Nombre de vacuna *</Text>
                <TouchableOpacity style={[styles.selector, errores.nombre && styles.inputError]}
                  onPress={() => { setMostrarVacunas(!mostrarVacunas); setMostrarInstituciones(false); }}>
                  <Text style={nombreVacuna ? styles.selectorValor : styles.selectorPlaceholder}>
                    {nombreVacuna || 'Selecciona una vacuna'}
                  </Text>
                  <Text>▼</Text>
                </TouchableOpacity>
                {mostrarVacunas && (
                  <View style={styles.dropdown}>
                    {VACUNAS_OFICIALES.map(v => (
                      <TouchableOpacity key={v} style={styles.dropdownItem}
                        onPress={() => { setNombreVacuna(v); setMostrarVacunas(false); setErrores(e => ({ ...e, nombre: null })); }}>
                        <Text style={styles.dropdownText}>{v}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

                <Text style={styles.label}>Fecha de aplicación *</Text>
                <TextInput style={[styles.input, errores.fecha && styles.inputError]}
                  placeholder="DD/MM/AAAA" placeholderTextColor="#aaa"
                  keyboardType="numeric" maxLength={10} value={fecha} onChangeText={handleFecha} />
                {errores.fecha && <Text style={styles.errorText}>{errores.fecha}</Text>}

                <Text style={styles.label}>Institución *</Text>
                <TouchableOpacity style={[styles.selector, errores.institucion && styles.inputError]}
                  onPress={() => { setMostrarInstituciones(!mostrarInstituciones); setMostrarVacunas(false); }}>
                  <Text style={institucion ? styles.selectorValor : styles.selectorPlaceholder}>
                    {institucion || 'Selecciona una institución'}
                  </Text>
                  <Text>▼</Text>
                </TouchableOpacity>
                {mostrarInstituciones && (
                  <View style={styles.dropdown}>
                    {INSTITUCIONES.map(i => (
                      <TouchableOpacity key={i} style={styles.dropdownItem}
                        onPress={() => { setInstitucion(i); setMostrarInstituciones(false); setErrores(e => ({ ...e, institucion: null })); }}>
                        <Text style={styles.dropdownText}>{i}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {errores.institucion && <Text style={styles.errorText}>{errores.institucion}</Text>}

                <Text style={styles.label}>Número de lote *</Text>
                <TextInput style={[styles.input, errores.lote && styles.inputError]}
                  placeholder="Ej: AB1234-MX" placeholderTextColor="#aaa"
                  value={lote} onChangeText={t => { setLote(t); setErrores(e => ({ ...e, lote: null })); }} />
                {errores.lote && <Text style={styles.errorText}>{errores.lote}</Text>}

                <Text style={styles.label}>Dosis *</Text>
                <TextInput style={[styles.input, errores.dosis && styles.inputError]}
                  placeholder="Ej: Dosis 1, Refuerzo, Anual..." placeholderTextColor="#aaa"
                  value={dosis} onChangeText={t => { setDosis(t); setErrores(e => ({ ...e, dosis: null })); }} />
                {errores.dosis && <Text style={styles.errorText}>{errores.dosis}</Text>}

                <TouchableOpacity style={styles.botonValidar} onPress={handleValidar}>
                  <Text style={styles.botonValidarText}>VALIDAR VACUNA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonCancelar} onPress={() => { limpiar(); setModalVisible(false); }}>
                  <Text style={styles.botonCancelarText}>Cancelar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {paso === 2 && (
              <View style={styles.pasoContainer}>
                <ActivityIndicator size="large" color="#2E6B3E" style={{ marginBottom: 24 }} />
                <Text style={styles.verificandoTitulo}>Verificando vacuna...</Text>
                <Text style={styles.verificandoSub}>Consultando con la Secretaría de Salud</Text>
              </View>
            )}

            {paso === 3 && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.certificadoHeader}>
                  <Text style={styles.certificadoTitulo}>Vacuna Validada</Text>
                  <Text style={styles.certificadoSub}>Certificado oficial emitido</Text>
                </View>
                <View style={styles.certificadoCard}>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoText}>ESTADO: VALIDADA</Text>
                  </View>
                  {[
                    ['Folio', folioGenerado],
                    ['Vacuna', nombreVacuna],
                    ['Institución', institucion],
                    ['Fecha', fecha],
                    ['Lote', lote],
                    ['Dosis', dosis],
                  ].map(([label, valor]) => (
                    <View key={label} style={styles.certificadoFila}>
                      <Text style={styles.certificadoLabel}>{label}</Text>
                      <Text style={styles.certificadoValor}>{valor}</Text>
                    </View>
                  ))}
                  <View style={styles.qrContainer}>
                    <FakeQR />
                    <Text style={styles.qrLabel}>Código de verificación oficial</Text>
                    <Text style={styles.qrSub}>SSA-MX · {folioGenerado}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.botonValidar} onPress={handleGuardar}>
                  <Text style={styles.botonValidarText}>GUARDAR EN MI HISTORIAL</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

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
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#aaa', fontSize: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4,
  },
  cardLeft: { flex: 1 },
  cardNombre: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  cardDosis: { fontSize: 13, color: '#555', marginBottom: 2 },
  cardFecha: { fontSize: 12, color: '#888', marginBottom: 2 },
  cardFolio: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  cardInstitucion: { fontSize: 11, color: '#aaa' },
  cardRight: { alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#e6f4ea', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#2E6B3E' },
  botonEliminar: { backgroundColor: '#fff0f0', borderRadius: 20, padding: 6 },
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
  botonValidar: {
    backgroundColor: '#2E6B3E', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginBottom: 12,
  },
  botonValidarText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  botonCancelar: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  botonCancelarText: { color: '#e74c3c', fontWeight: '600', fontSize: 15 },
  pasoContainer: { alignItems: 'center', paddingVertical: 40 },
  verificandoTitulo: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  verificandoSub: { fontSize: 14, color: '#888', marginBottom: 30 },
  certificadoHeader: { alignItems: 'center', marginBottom: 20 },
  certificadoTitulo: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  certificadoSub: { fontSize: 13, color: '#888', marginTop: 4 },
  certificadoCard: {
    backgroundColor: '#f9f9f9', borderRadius: 16, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0',
  },
  estadoBadge: { backgroundColor: '#e6f4ea', borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 16 },
  estadoText: { color: '#2E6B3E', fontWeight: 'bold', fontSize: 14 },
  certificadoFila: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  certificadoLabel: { fontSize: 13, color: '#888' },
  certificadoValor: { fontSize: 13, color: '#222', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  qrLabel: { fontSize: 12, color: '#888', marginTop: 10 },
  qrSub: { fontSize: 11, color: '#2E6B3E', fontWeight: '600', marginTop: 4 },
});