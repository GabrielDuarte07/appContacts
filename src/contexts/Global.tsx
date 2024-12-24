import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { TypeContact, Contact, useContacts } from "@/hooks/useContacts";
import { Alert } from "@/components/Alert";
import { useToast } from "native-base";

type GlobalContextProps = {
  typeContacts: TypeContact[];
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
  setTypeContacts: Dispatch<SetStateAction<TypeContact[]>>;
};

export const GlobalContext = createContext({} as GlobalContextProps);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const { listContactTypes, listContacts } = useContacts();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [typeContacts, setTypeContacts] = useState<TypeContact[]>([]);
  const toast = useToast();

  useEffect(() => {
    listContacts()
      .then(resolve => setContacts(resolve.contacts))
      .catch(() => {
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert
              title="Error"
              status="error"
              colorScheme="danger"
              description="Erro ao resgatar contatos"
            />
          ),
        });
      });
  }, []);

  useEffect(() => {
    listContactTypes()
      .then(resolve => setTypeContacts(resolve.types))
      .catch(() => {
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert
              title="Error"
              status="error"
              colorScheme="danger"
              description="Erro ao resgatar tipos de contatos"
            />
          ),
        });
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ contacts, setContacts, typeContacts, setTypeContacts }}>
      {children}
    </GlobalContext.Provider>
  );
}
