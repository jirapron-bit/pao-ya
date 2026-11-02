import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome, login, home, scan, mymeds, pharmacy
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. หน้า Welcome (ต้อนรับ)
  if (currentScreen === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.centerContent}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="medical-bag" size={60} color="#2D7A4C" />
            <Text style={styles.logoSubText}>PAOYA</Text>
          </View>
          <Text style={styles.welcomeTitle}>เป๋ายา</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCurrentScreen('login')}>
          <Text style={styles.primaryButtonText}>เข้าใช้งาน</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 2. หน้า Login
  if (currentScreen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('welcome')}>
          <Ionicons name="chevron-back" size={28} color="#666" />
        </TouchableOpacity>
        <View style={styles.authContainer}>
          <View style={styles.pillIconHeader}>
            <MaterialCommunityIcons name="pill" size={40} color="#333" />
          </View>
          <Text style={styles.authTitle}>เข้าสู่ระบบ</Text>

          <Text style={styles.inputLabel}>อีเมล หรือ ชื่อผู้ใช้</Text>
          <TextInput
            style={styles.input}
            placeholder="ใส่อีเมล หรือ ชื่อผู้ใช้"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>รหัสผ่าน</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="ใส่รหัสผ่าน"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Ionicons name="eye-off-outline" size={20} color="#666" />
          </View>

          <TouchableOpacity style={styles.linkRight}>
            <Text style={styles.linkText}>ลืมรหัสผ่าน</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRight}>
            <Text style={styles.linkText}>สร้างบัญชี</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, styles.disabledBtn]}
            onPress={() => setCurrentScreen('home')}>
            <Text style={styles.disabledBtnText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 3. หน้าจอหลักของแอปที่มี Bottom Nav (Home, MyMeds, Scan, Pharmacy)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Content */}
      <View style={{ flex: 1 }}>
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'mymeds' && <MyMedsScreen />}
        {currentScreen === 'scan' && <ScanScreen />}
        {currentScreen === 'pharmacy' && <PharmacyScreen />}
      </View>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.floatingChatBtn}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#2D7A4C" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="home" size={24} color={currentScreen === 'home' ? '#1B5E20' : '#8E8E93'} />
          <Text style={[styles.navLabel, currentScreen === 'home' && styles.navLabelActive]}>หน้าหลัก</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('mymeds')}>
          <MaterialCommunityIcons name="medical-bag" size={24} color={currentScreen === 'mymeds' ? '#1B5E20' : '#8E8E93'} />
          <Text style={[styles.navLabel, currentScreen === 'mymeds' && styles.navLabelActive]}>ยาของฉัน</Text>
        </TouchableOpacity>

        {/* Scan Center Button */}
        <TouchableOpacity style={styles.scanNavItem} onPress={() => setCurrentScreen('scan')}>
          <View style={styles.scanIconBox}>
            <Ionicons name="scan-outline" size={28} color="#FFF" />
          </View>
          <Text style={styles.scanLabel}>สแกน</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('pharmacy')}>
          <Ionicons name="location" size={24} color={currentScreen === 'pharmacy' ? '#1B5E20' : '#8E8E93'} />
          <Text style={[styles.navLabel, currentScreen === 'pharmacy' && styles.navLabelActive]}>ร้านยา</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-sharp" size={24} color="#8E8E93" />
          <Text style={styles.navLabel}>ตั้งค่า</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---- Components ย่อยของแต่ละหน้า ---- //

function HomeScreen() {
  const medicines = [
    { title: 'พาราเซตามอล', sub: 'Paracetamol  บรรเทาปวด ลดไข้' },
    { title: 'อะม็อกซี่', sub: 'Amoxicillin  ยาปฏิชีวนะ' },
    { title: 'บรูเฟน', sub: 'Ibuprofen  ยาต้านการอักเสบชนิดไม่ใช่สเตียรอยด์ (NSAID)' },
    { title: 'เมทฟอร์มิน', sub: 'Metformin  ยาควบคุมเบาหวานชนิดรับประทาน' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topHeaderBar}>
        <Text style={styles.topHeaderTitle}>สวัสดี คุณยาเมเต</Text>
      </View>
      <ScrollView style={styles.contentPadding}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput placeholder="ค้นหาชื่อยา" style={{ flex: 1 }} />
        </View>
        <Text style={styles.sectionTitle}>ผลิตภัณฑ์ยา</Text>
        {medicines.map((item, index) => (
          <View key={index} style={styles.medCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medTitle}>{item.title}</Text>
              <Text style={styles.medSub}>{item.sub}</Text>
            </View>
            <Ionicons name="star-outline" size={22} color="#333" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function MyMedsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.simpleHeader}>
        <Text style={styles.simpleHeaderTitle}>ยาของฉัน</Text>
      </View>
      <View style={styles.contentPadding}>
        <View style={styles.menuCard}>
          <Ionicons name="heart-outline" size={32} color="#333" style={{ marginRight: 15 }} />
          <View>
            <Text style={styles.menuCardTitle}>ยาประจำ</Text>
            <Text style={styles.menuCardSub}>บันทึกยาที่ทานประจำของคุณ</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <Ionicons name="calendar-outline" size={32} color="#333" style={{ marginRight: 15 }} />
          <View>
            <Text style={styles.menuCardTitle}>วันนัดหมาย</Text>
            <Text style={styles.menuCardSub}>บันทึกวันนัดหมายแพทย์ของคุณ</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ScanScreen() {
  return (
    <View style={styles.scanBgContainer}>
      <View style={styles.cameraFrame}>
        <View style={styles.scanTargetBox} />
      </View>
      <TouchableOpacity style={styles.galleryIconBtn}>
        <Ionicons name="image-outline" size={26} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

function PharmacyScreen() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topHeaderBar}>
        <Text style={styles.topHeaderTitle}>ร้านขายยาใกล้ฉัน</Text>
      </View>
      <View style={styles.mapPlaceholder}>
        <Text style={{ color: '#2D7A4C', fontWeight: 'bold' }}>📍 [ส่วนแสดงแผนที่ Map]</Text>
      </View>
      <View style={[styles.contentPadding, { flex: 1, backgroundColor: '#FFF' }]}>
        <View style={styles.pharmacyItem}>
          <View>
            <Text style={styles.pharmacyName}>ร้านยาสุขใจ สาขาคลองหลวง</Text>
            <Text style={styles.pharmacySub}>เปิดถึง 21:00 น.  พาราเซตามอล 15฿</Text>
          </View>
          <Text style={styles.distanceText}>0.6 กม.</Text>
        </View>
        <View style={styles.pharmacyItem}>
          <View>
            <Text style={styles.pharmacyName}>เภสัชกรใกล้บ้าน</Text>
            <Text style={styles.pharmacySub}>เปิดถึง 22:00 น.  พาราเซตามอล 18฿</Text>
          </View>
          <Text style={styles.distanceText}>1.2 กม.</Text>
        </View>
      </View>
    </View>
  );
}

// ---- Styling (ปรับตามสไตล์ Figma) ---- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#2D7A4C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSubText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D7A4C',
    marginTop: 4,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D7A4C',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    marginHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 16,
  },
  authContainer: {
    paddingHorizontal: 30,
    flex: 1,
  },
  pillIconHeader: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  authTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
  },
  linkRight: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  linkText: {
    color: '#2D7A4C',
    textDecorationLine: 'underline',
  },
  disabledBtn: {
    backgroundColor: '#E0E0E0',
    marginTop: 30,
  },
  disabledBtnText: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topHeaderBar: {
    backgroundColor: '#004D25',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  topHeaderTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  simpleHeader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  simpleHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentPadding: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  medCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  medTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medSub: {
    fontSize: 12,
    color: '#666',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuCardSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scanBgContainer: {
    flex: 1,
    backgroundColor: '#B2C8C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrame: {
    width: '80%',
    height: '65%',
    borderWidth: 3,
    borderColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTargetBox: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  galleryIconBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 10,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: '#E5F0EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pharmacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  pharmacyName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  pharmacySub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#2D7A4C',
    fontWeight: 'bold',
  },
  floatingChatBtn: {
    position: 'absolute',
    bottom: 75,
    right: 20,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 25,
    elevation: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#E8F8F0',
    borderTopWidth: 1,
    borderTopColor: '#D0EBE0',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  scanNavItem: {
    alignItems: 'center',
    top: -15,
  },
  scanIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#004D25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLabel: {
    fontSize: 10,
    color: '#1B5E20',
    marginTop: 2,
    fontWeight: 'bold',
  },
});
