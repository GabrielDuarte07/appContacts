import { useSQLiteContext } from "expo-sqlite";

export type TypeContact = {
  tp_id?: string;
  tp_name?: string;
  tp_created_at?: string;
  tp_updated_at?: string;
};

export type Contact = {
  id?: string;
  name?: string;
  nascimento?: string;
  email?: string;
  celular?: string;
  avatar?: string;
  tp_id?: string;
  created_at?: string;
  updated_at?: string;
};

type ContactCreate = {
  name: string;
  nascimento: string;
  email: string;
  celular: string;
  avatar?: string;
  tp_id: string;
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

  async function getContactById(id: number) {
    const query = `
      SELECT A.* FROM Contato A WHERE A.id = ?
    `;
    try {
      const contact = await db.getFirstAsync<Contact>(query, [id]);
      return { contact };
    } catch (e) {
      throw e;
    }
  }

  async function getContactTypeByName(name: string) {
    const query = "SELECT * FROM Tipo_Contato WHERE tp_name like ?";

    try {
      const types = await db.getAllAsync<TypeContact>(query, [`%${name.trim()}%`]);
      return { types };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function createContactType({ tp_name }: Required<Pick<TypeContact, "tp_name">>) {
    const statement = await db.prepareAsync("INSERT INTO Tipo_Contato(tp_name) VALUES ($name)");
    try {
      const { types } = await getContactTypeByName(tp_name);
      if (types.length > 0) {
        throw new ContactError("Já existe um tipo de contato com esse nome");
      }

      const { lastInsertRowId } = await statement.executeAsync({ $name: tp_name.trim() });
      // const { lastInsertRowId } = await db.runAsync(
      //   "INSERT INTO Tipo_Contato(tp_name) VALUES (?)",
      //   tp_name,
      // );
      const { type } = await getContactTypeById(lastInsertRowId);
      return { created: type };
    } catch (e) {
      throw e;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function removeContacyType(id: number) {
    const query = "DELETE FROM Tipo_Contato WHERE tp_id = $id";
    const statement = await db.prepareAsync(query);
    try {
      const { type } = await getContactTypeById(id);
      if (!type) {
        throw new ContactError("Tipo não encontrado para remoção");
      }
      await statement.executeAsync({ $id: id });

      return { deleted: type };
    } catch (e) {
      throw e;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function removeContact(id: number) {
    const query = "DELETE FROM Contato WHERE id = $id";
    const statement = await db.prepareAsync(query);
    try {
      const { contact } = await getContactById(id);
      if (!contact) {
        throw new ContactError("Contato não encontrado");
      }
      await statement.executeAsync({ $id: id });
      return { contact };
    } catch (err) {
      throw err;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function listContacts(name?: string) {
    let query = "SELECT * FROM Contato";
    if (name) {
      query += ` WHERE name like %?%`;
    }

    try {
      const contacts = await db.getAllAsync<Contact>(query, [name ?? ""]);
      return { contacts };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function createContact({ name, celular, email, nascimento, tp_id, avatar }: ContactCreate) {
    const query = `
      INSERT INTO Contato(name,nascimento,email,celular,avatar,tp_id)
      VALUES ($name,$nascimento,$email,$celular,$avatar,$tp_id)
    `;

    const statement = await db.prepareAsync(query);
    try {
      const avatarValue = avatar ? avatar : null;
      const { lastInsertRowId } = await statement.executeAsync({
        $name: name,
        $nascimento: nascimento,
        $email: email,
        $celular: celular,
        $avatar: avatarValue,
        $tp_id: Number(tp_id),
      });

      if (!lastInsertRowId) {
        throw new ContactError("Erro ao retornar novo contato");
      }

      const { contact } = await getContactById(lastInsertRowId);
      return { contact };
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
    removeContacyType,
    removeContact,
    listContacts,
    createContact,
    getContactById,
  };
}
