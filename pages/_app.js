import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";
import { I18nProvider } from "@/context/i18n";


export default function App({ Component, pageProps }) {
  return (
    
      <NextUIProvider>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <I18nProvider>
        <Component {...pageProps} />
        </I18nProvider>
        

      </NextUIProvider>
    
  );
}
