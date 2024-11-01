import { createContext, ReactNode } from "react";
import { TypeContact, Contact, useContacts } from "@/hooks/useContacts";

type GlobalContextProps = {
  types: TypeContact[];
  ContactsList: Contact[];
};

const GlobalContext = createContext({} as GlobalContextProps);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const { listContactTypes } = useContacts();
  return <GlobalContext.Provider value={}>{children}</GlobalContext.Provider>;
}
