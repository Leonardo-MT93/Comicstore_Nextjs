import { useRouter } from "next/router";
import { createContext, useCallback, useContext } from "react";
import es from "../translation/es.json";
import en from "../translation/en.json";

const I18NContext = createContext();

const languajes = { es, en };

export function I18nProvider({ children }) {
  const { locale } = useRouter();
  const t = useCallback((key, ...args) => {  //USAMOS USECALLBACK EN EL METODO DONDE NOS QUEREMOS ASEGURAR QUE SOLO CAMBIA UNA DEPENDENCIA
    let translation =  languajes[locale][key]   
    if(args.length === 0) return translation

        args.forEach((value, index)=> 
        {
         translation =   translation.replace(`\${${index+1}}`, value)
        })
        return translation
    
  },[locale]) //solo queremos que se regenere cuando cambie el idioma -- Se intenta optimizar el rendimiento y evitar problemas
  
  return( <I18NContext.Provider value={{ t }}>
    {children}
  </I18NContext.Provider>)
}

export function useI18N (){ //CUSTOM HOOK
    const context = useContext(I18NContext) 
    if(context === undefined){
        throw new Error("useI18N must be usedwithin a I18NProvider")
    }
    return context
}

