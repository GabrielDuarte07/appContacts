import { useSQLiteContext } from "expo-sqlite";

export type TypeContact = {
  tp_id: string;
  tp_name: string;
  created_at: string;
  updated_at: string;
};

export class ContactError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ContactError";
  }
}

export function useContacts() {
  const db = useSQLiteContext();

  async function listContactTypes(name?: string) {
    let query = "SELECT * FROM Tipo_Contato";
    if (name) {
      query += ` WHERE tp_name like '%?%'`;
    }

    try {
      const types = await db.getAllAsync<TypeContact>(query, [name?.trim() ?? ""]);
      return { types };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function getContactTypeById(id: number) {
    const query = "SELECT * FROM Tipo_Contato WHERE tp_id = ?";

    try {
      const type = await db.getFirstAsync<TypeContact>(query, [id]);
      return { type };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function getContactTypeByName(name: string) {
    const query = "SELECT * FROM Tipo_Contato WHERE tp_name = ?";

    try {
      const types = await db.getAllAsync<TypeContact>(query, [name.trim()]);
      return { types };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function createContactType({ tp_name }: Pick<TypeContact, "tp_name">) {
    const query = "INSERT INTO Tipo_Contato(tp_name) VALUES ($name)";
    const statement = await db.prepareAsync(query);
    try {
      const { types } = await getContactTypeByName(tp_name);
      if (types.length > 0) {
        throw new ContactError("Já existe um tipo de contato com esse nome");
      }

      const { lastInsertRowId } = await statement.executeAsync({ $name: tp_name.trim() });
      const created = await getContactTypeById(lastInsertRowId);
      return { created };
    } catch (e) {
      throw e;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return {
    listContactTypes,
    getContactTypeById,
    createContactType,
    getContactTypeByName,
  };
}
