import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

# 1. เชื่อมต่อ Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. อ่านไฟล์ข้อมูล (เลือกใช้ read_csv หรือ read_excel ตามประเภทไฟล์)
# หากใช้ไฟล์ .csv: df = pd.read_csv('datadrug.csv')
df = pd.read_excel('datadrug.xlsx', sheet_name='Restructured_NLEM_Data')

# 3. นำข้อมูลขึ้น Firestore เป็นชุด (Batch)
collection_ref = db.collection('Data_Med')
batch = db.batch()
count = 0

for index, row in df.iterrows():
    doc_ref = collection_ref.document() # สุ่ม Auto-ID
    
    # จัดเตรียมโครงสร้างข้อมูล
    data = {
        'no': int(row['ลำดับ (No.)']) if pd.notna(row['ลำดับ (No.)']) else 0,
        'main_group': str(row['ชื่อหมวดหมู่หลัก (Main Group)']) if pd.notna(row['ชื่อหมวดหมู่หลัก (Main Group)']) else "",
        'subgroup_path': str(row['หมวดหมูีย่อย (Subgroup Path)']) if pd.notna(row['หมวดหมูีย่อย (Subgroup Path)']) else "",
        'generic_name': str(row['ชื่อสามัญทางยา (Generic Name)']) if pd.notna(row['ชื่อสามัญทางยา (Generic Name)']) else "",
        'dosage_form': str(row['รูปแบบยา (Dosage Form)']) if pd.notna(row['รูปแบบยา (Dosage Form)']) else "",
        'strength_salt': str(row['ความแรง / เกลือ (Strength/Salt)']) if pd.notna(row['ความแรง / เกลือ (Strength/Salt)']) else "",
        'sub_account_old': str(row['บัญชีย่อยเดิม']) if pd.notna(row['บัญชีย่อยเดิม']) else "",
        'sub_account_new': str(row['บัญชีย่อยใหม่']) if pd.notna(row['บัญชีย่อยใหม่']) else "",
        'change_code': str(row['รหัสการเปลี่ยนแปลง (Change Code)']) if pd.notna(row['รหัสการเปลี่ยนแปลง (Change Code)']) else "",
        'change_detail': str(row['รายละเอียดการเปลี่ยนแปลง']) if pd.notna(row['รายละเอียดการเปลี่ยนแปลง']) else "",
        'conditions': str(row['เงื่อนไขการใช้ยา']) if pd.notna(row['เงื่อนไขการใช้ยา']) else "",
        'remarks': str(row['คำเตือน / หมายเหตุเพิ่มเติม']) if pd.notna(row['คำเตือน / หมายเหตุเพิ่มเติม']) else "",
        'announcement_date': str(row['วันที่ประกาศราชกิจจาฯ']) if pd.notna(row['วันที่ประกาศราชกิจจาฯ']) else ""
    }
    
    batch.set(doc_ref, data)
    count += 1
    
    # Firestore กำหนดให้เขียนข้อมูลใน 1 Batch ได้ไม่เกิน 500 รายการ
    if count % 400 == 0:
        batch.commit()
        batch = db.batch()
        print(f"นำเข้าข้อมูลแล้ว {count} รายการ...")

# Commit ข้อมูลส่วนที่เหลือ
if count % 400 != 0:
    batch.commit()

print(f"เสร็จสิ้น! อิมพอร์ตข้อมูลทั้งหมด {count} รายการเรียบร้อยแล้ว")