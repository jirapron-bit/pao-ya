import sqlite3
import bcrypt

def init_db():
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()

    # 1. ตาราง users (ปรับปรุงให้รองรับข้อมูลส่วนตัวในหน้าโปรไฟล์)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            age INTEGER CHECK(age > 0),
            blood_type TEXT,
            weight REAL,
            height REAL,
            medical_condition TEXT,
            phone TEXT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. ตาราง allergies (ตารางประวัติแพ้ยา เชื่อมโยงกับผู้ใช้ผ่าน user_id)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS allergies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            drug_name TEXT NOT NULL,
            symptom TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')

    conn.commit()
    conn.close()
    print("สร้าง/อัปเดตฐานข้อมูล paoya_users.db เรียบร้อยแล้ว!")

# --- ฟังก์ชันจัดการข้อมูลส่วนตัว (Profile) ---
def update_user_profile(user_id, blood_type, weight, height, medical_condition, phone):
    """อัปเดตข้อมูลส่วนตัวของผู้ใช้"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users 
        SET blood_type = ?, weight = ?, height = ?, medical_condition = ?, phone = ?
        WHERE id = ?
    ''', (blood_type, weight, height, medical_condition, phone, user_id))
    conn.commit()
    conn.close()

def get_user_profile(user_id):
    """ดึงข้อมูลส่วนตัวของผู้ใช้ตาม user_id"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT first_name, last_name, age, blood_type, weight, height, medical_condition, phone, email 
        FROM users WHERE id = ?
    ''', (user_id,))
    profile = cursor.fetchone()
    conn.close()
    return profile

# --- ฟังก์ชันจัดการประวัติแพ้ยา (Allergies) ---
def add_allergy(user_id, drug_name, symptom):
    """เพิ่มรายการประวัติแพ้ยาใหม่"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO allergies (user_id, drug_name, symptom)
        VALUES (?, ?, ?)
    ''', (user_id, drug_name, symptom))
    conn.commit()
    conn.close()

def get_user_allergies(user_id):
    """ดึงรายการประวัติแพ้ยาทั้งหมดของผู้ใช้"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, drug_name, symptom FROM allergies WHERE user_id = ?
    ''', (user_id,))
    allergies = cursor.fetchall()
    conn.close()
    return allergies

def delete_allergy(allergy_id, user_id):
    """ลบรายการประวัติแพ้ยาตาม ID"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM allergies WHERE id = ? AND user_id = ?', (allergy_id, user_id))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()