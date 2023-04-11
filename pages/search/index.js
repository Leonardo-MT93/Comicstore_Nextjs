import Layout from "@/components/Layout";
import { useI18N } from "@/context/i18n";
import { search } from "@/services/search";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Component({ query, results }) {
    const {t} = useI18N();
  return (
    <>
      <Head>
        <title>xkcd - Results for {query}</title>
        <meta name="description" content={`Search results for ${query}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <h1>
            {t('SEARCH_RESULTS_TITLE', results.length, query)}
        </h1>
        {results.map((result) => {
          return (
            <Link href={ `/comic/${result.id}`} key={result.id} className="flex flex-row content-center justify-start bg-slate-300 hover:bg-slate-50">
              <Image
                width="50"
                height="50"
                alt={result.alt}
                src={result.img}
                className="rounded-full"
              ></Image>
              <div>
                <h2>{result.title}</h2>
              </div>
            </Link>
          );
        })}
      </Layout>
    </>
  );
};



export async function getServerSideProps(context) {
  const { query } = context;
  // UNDEFINED no puede ser serializado como JSON. Habra que inicializar el resultado de la busqueda como string vacio
  const { q = "" } = query;

  //Llamar a la API de algolia para buscar los resultados
  //Esto esta mal ya que no se puede hacer la llamada a una API declarada en el mismo proyecto, se deberia llamar directamente al microservicio. Solo a una API externa.
  //Todo esto funcionaria pero es una muy mala practica.
  //Hay que crear una pagina de busqueda en donde se llame al microservicio directamente.
  //Podria no funcionar ya que vercel cuando desplega este servicio lo hace de manera separada a nuestra aplicacion
  //   const host = __NEXT_DEV_ONLY
  //   ? 'HTTP://LOCALHOST:3000'     //Ejemplo en modo desarrollo
  //   : 'https://xkcd-api.now.sh'   //Ejemplo en produccion
  //   const response = await fetch(`${host}`+'/api/search?q='`${q}`)
  //   const result = await response.json()

  const {results} = await search({ query: q });

  return {
    props: {
      query: q,
      results
    },
  };
}
