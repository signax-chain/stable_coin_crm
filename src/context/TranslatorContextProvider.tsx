import axios from "axios";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface TranslationContextProps {
  children: ReactNode;
}

interface TranslationContextValue {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  translate: (
    text: string,
    targetLanguage?: string
  ) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined
);

export const TranslationProvider: React.FC<TranslationContextProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState("en");
  const [previousLanguage, setPreviousLanguage] = useState('en');

  const translate = async (
    text: string,
    targetLanguage = language
  ): Promise<string> => {
    setPreviousLanguage(language);
    setLanguage(targetLanguage);
    if (previousLanguage === targetLanguage) {
      return text;
    }
    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", previousLanguage!);
    encodedParams.set("target_language", targetLanguage);
    encodedParams.set("text", text);
    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": `${process.env.REACT_APP_RAPID_API_KEY}`,
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };
    return axios
      .request(options)
      .then((response) => response.data.data.translatedText).catch((error) => `text_${error}`);
  };

  const contextValue: TranslationContextValue = {
    language,
    setLanguage,
    translate,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextValue => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
