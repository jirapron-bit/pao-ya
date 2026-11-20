-- Dataset: paoya_account (ข้อมูลบัญชีผู้ใช้ เป๋ายา)
CREATE TABLE IF NOT EXISTS paoya_account (
  id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  username        VARCHAR(50)      NOT NULL,
  password_hash   VARCHAR(255)     NOT NULL,
  email           VARCHAR(255)     NOT NULL,
  first_name      VARCHAR(100)     NOT NULL,
  last_name       VARCHAR(100)     NOT NULL,
  age             TINYINT UNSIGNED NOT NULL,
  chronic_disease TEXT             NULL,
  created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_paoya_account_username (username),
  UNIQUE KEY uq_paoya_account_email (email),
  CONSTRAINT chk_paoya_account_age CHECK (age BETWEEN 1 AND 150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
