"use client";


import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";


interface ContextProps {
  countryCode: string;
  setCountryCode: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
  countryCode: "",
  setCountryCode: (): string => "",
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [countryCode, setCountryCode] = useState("");

  return (
    <GlobalContext.Provider value={{ countryCode, setCountryCode }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
