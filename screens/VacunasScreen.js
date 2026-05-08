import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const vacunasMock = [
  { id: '1', nombre: 'COVID-19', fecha: '12/01/2022', dosis: 'Dosis 1', estado: 'Aplicada' },
  { id: '2', nombre: 'COVID-19', fecha: '05/02/2022', dosis: 'Dosis 2', estado: 'Aplicada' },
  { id: '3', nombre: 'Influenza', fecha: '10/10/2023', dosis: 'Anual', estado: 'Aplicada' },
  { id: '4', nombre: 'Hepatitis B', fecha: '---', dosis: 'Dosis 1', estado: 'Pendiente' },
];

export default function VacunasScreen() {
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
        data={vacunasMock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardNombre}>{item.nombre}</Text>
              <Text style={styles.cardDosis}>{item.dosis}</Text>
              <Text style={styles.cardFecha}>📅 {item.fecha}</Text>
            </View>
            <View style={[
              styles.badge,
              item.estado === 'Aplicada' ? styles.badgeVerde : styles.badgeAmarillo
            ]}>
              <Text style={styles.badgeText}>{item.estado}</Text>
            </View>
          </View>
        )}
      />

      {/* Botón agregar */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+ Agregar vacuna</Text>
      </TouchableOpacity>

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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeVerde: { backgroundColor: '#e6f4ea' },
  badgeAmarillo: { backgroundColor: '#fff8e1' },
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
});