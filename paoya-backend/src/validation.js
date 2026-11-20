const USERNAME_RE = /^[A-Za-z0-9_.]{3,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILE_FIELDS = ['email', 'first_name', 'last_name', 'age', 'chronic_disease'];

function asTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function validateField(field, rawValue, errors) {
  const value = asTrimmedString(rawValue);

  switch (field) {
    case 'username':
      if (typeof value !== 'string' || !USERNAME_RE.test(value)) {
        errors.username = 'ชื่อผู้ใช้ต้องมี 3-50 ตัวอักษร (a-z, 0-9, _ หรือ .)';
      }
      return value;
    case 'password':
      if (typeof rawValue !== 'string' || rawValue.length < 8 || rawValue.length > 72) {
        errors.password = 'รหัสผ่านต้องมีความยาว 8-72 ตัวอักษร';
      }
      return rawValue;
    case 'email':
      if (typeof value !== 'string' || value.length > 255 || !EMAIL_RE.test(value)) {
        errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      }
      return typeof value === 'string' ? value.toLowerCase() : value;
    case 'first_name':
    case 'last_name':
      if (typeof value !== 'string' || value.length < 1 || value.length > 100) {
        errors[field] = field === 'first_name' ? 'กรุณากรอกชื่อ (ไม่เกิน 100 ตัวอักษร)' : 'กรุณากรอกนามสกุล (ไม่เกิน 100 ตัวอักษร)';
      }
      return value;
    case 'age': {
      const age = Number(value);
      if (!Number.isInteger(age) || age < 1 || age > 150) {
        errors.age = 'อายุต้องเป็นจำนวนเต็มระหว่าง 1-150';
      }
      return age;
    }
    case 'chronic_disease':
      if (value === undefined || value === null || value === '') return null;
      if (typeof value !== 'string' || value.length > 2000) {
        errors.chronic_disease = 'โรคประจำตัวต้องเป็นข้อความไม่เกิน 2000 ตัวอักษร';
      }
      return value;
    default:
      return value;
  }
}

function validateRegistration(body = {}) {
  const errors = {};
  const data = {};
  for (const field of ['username', 'password', ...PROFILE_FIELDS]) {
    data[field] = validateField(field, body[field], errors);
  }
  return { data, errors };
}

function validateProfileUpdate(body = {}) {
  const errors = {};
  const data = {};
  for (const field of PROFILE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = validateField(field, body[field], errors);
    }
  }
  if (Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    errors._ = 'ไม่มีข้อมูลที่ต้องการแก้ไข';
  }
  return { data, errors };
}

function validatePassword(value) {
  const errors = {};
  validateField('password', value, errors);
  return errors.password;
}

module.exports = { validateRegistration, validateProfileUpdate, validatePassword, PROFILE_FIELDS };
