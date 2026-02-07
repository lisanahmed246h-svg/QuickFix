import en from "./en";
import bn from "./bn";
import { Language } from "@/context/LanguageContext";

export const translations = {
  en,
  bn,
};

export function getTranslation(lang: Language) {
  return translations[lang];
}
