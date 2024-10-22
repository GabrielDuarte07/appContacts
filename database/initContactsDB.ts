import { type SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Tipo_Contato(
      tp_id INTEGER PRIMARY KEY AUTOINCREMENT,
      tp_name VARCHAR(255) NOT NULL UNIQUE,
      tp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      tp_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS Tipo_Contato_Updated AFTER UPDATE ON Tipo_Contato
    WHEN old.tp_updated_at <> CURRENT_TIMESTAMP
    BEGIN
      UPDATE Tipo_Contato SET tp_updated_at = CURRENT_TIMESTAMP WHERE tp_id=old.id;
    END;

    CREATE TABLE IF NOT EXISTS Contato(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name varchar(255) NOT NULL,
      nascimento DATETIME NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      celular varchar(25) NOT NULL,
      avatar varchar(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      tp_id int NOT NULL,
      CONSTRAINT fk_contato FOREIGN KEY(tp_id) REFERENCES Tipo_Contato(tp_id)
    );

    CREATE TRIGGER IF NOT EXISTS Contato_updated AFTER UPDATE ON Contato
    WHEN old.updated_at <> CURRENT_TIMESTAMP
    BEGIN
      UPDATE Contato SET updated_at = CURRENT_TIMESTAMP WHERE tp_id=old.tp_id;
    END;
  `);
}
