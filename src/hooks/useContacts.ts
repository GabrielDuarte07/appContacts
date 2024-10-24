import { useSQLiteContext } from "expo-sqlite";

export type TypeContact = {
  tp_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export function useContacts() {
  const db = useSQLiteContext();

  async function listCategoryTypes(name?: string) {
    let query = "SELECT * FROM Tipo_Contato";
    if (name) {
      query += ` WHERE tp_name like '%?%'`;
    }

    try {
      const types = await db.getAllAsync<TypeContact>(query, [name ?? ""]);
      return { types };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  return {
    listCategoryTypes,
  };
}
