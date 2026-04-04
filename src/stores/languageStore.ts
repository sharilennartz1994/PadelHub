import { create } from 'zustand'

type Language = 'it' | 'en'

interface LanguageState {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'it',
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'it' ? 'en' : 'it' })),
  setLanguage: (language: Language) => set({ language }),
}))
