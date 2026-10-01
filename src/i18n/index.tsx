import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, TranslationKeys, translations, SUPPORTED_LOCALES } from './locales';

interface I18nContextType {
  locale: Locale;
  t: TranslationKeys;
  setLocale: (locale: Locale) => void;
  dir: 'ltr' | 'rtl';
}

const STORAGE_KEY = 'tallywise-locale';

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved as Locale]) return saved as Locale;
    } catch {}
    // Try browser language
    const browserLang = navigator.language?.split('-')[0] as Locale;
    if (translations[browserLang]) return browserLang;
  }
  return 'en';
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
  dir: 'ltr',
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {}
    // Update document direction for RTL languages
    const localeInfo = SUPPORTED_LOCALES.find(l => l.code === newLocale);
    if (localeInfo) {
      document.documentElement.dir = localeInfo.dir;
      document.documentElement.lang = newLocale;
    }
  }, []);

  useEffect(() => {
    const localeInfo = SUPPORTED_LOCALES.find(l => l.code === locale);
    if (localeInfo) {
      document.documentElement.dir = localeInfo.dir;
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value: I18nContextType = {
    locale,
    t: translations[locale],
    setLocale,
    dir: SUPPORTED_LOCALES.find(l => l.code === locale)?.dir || 'ltr',
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export { SUPPORTED_LOCALES };
export type { Locale };
