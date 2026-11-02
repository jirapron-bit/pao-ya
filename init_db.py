import sqlite3
import bcrypt

def init_db():
    # เชื่อมต่อฐานข้อมูล sqlite (หากไม่มีไฟล์ระบบจะสร้างให้อัตโนมัติ)
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()

    # สร้างตาราง users สำหรับเก็บข้อมูลบัญชีผู้ใช้
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            age INTEGER CHECK(age > 0),
            medical_condition TEXT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print("สร้างฐานข้อมูล paoya_users.db และตาราง users เรียบร้อยแล้ว!")

def register_user(first_name, last_name, age, medical_condition, email, username, password):
    """ฟังก์ชันสำหรับสมัครสมาชิกและแฮชรหัสผ่านลงฐานข้อมูล"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()

    # เข้ารหัสรหัสผ่านด้วย bcrypt เพื่อความปลอดภัย
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        cursor.execute('''
            INSERT INTO users (first_name, last_name, age, medical_condition, email, username, password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (first_name, last_name, age, medical_condition, email, username, hashed_pw))
        
        conn.commit()
        print(f"สมัครสมาชิกสำเร็จสำหรับผู้ใช้: {username}")
        return True
    except sqlite3.IntegrityError as e:
        print(f"สมัครสมาชิกไม่สำเร็จ: อีเมลหรือชื่อผู้ใช้นี้มีในระบบแล้ว ({e})")
        return False
    finally:
        conn.close()

def login_user(username_or_email, password):
    """ฟังก์ชันตรวจสอบการเข้าสู่ระบบ"""
    conn = sqlite3.connect('paoya_users.db')
    cursor = conn.cursor()

    cursor.execute('''
        SELECT id, first_name, last_name, password_hash FROM users 
        WHERE username = ? OR email = ?
    ''', (username_or_email, username_or_email))

    user = cursor.fetchone()
    conn.close()

    if user:
        user_id, first_name, last_name, stored_hash = user
        # ตรวจสอบรหัสผ่านที่ป้อนกับ Hash ใน DB
        if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
            print(f"เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ คุณ {first_name} {last_name}")
            return {"id": user_id, "first_name": first_name, "last_name": last_name}
    
    print("ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง")
    return None

if __name__ == "__main__":
    init_db()
