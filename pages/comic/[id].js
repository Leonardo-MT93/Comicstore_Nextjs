import { Header } from "@/components/Header";
import Head from "next/head";
import Image from "next/image";
import { readFile, stat } from "fs/promises";
import Link from "next/link";
import fs from "fs/promises";
import { basename } from "path";
import Layout from "@/components/Layout";

export default function Comic({
  img,
  alt,
  title,
  width,
  height,
  nextId,
  prevId,
  hasNext,
  hasPrevious,
}) {
  return (
    <>
      <Head>
        <title>Comics x developers</title>
        <meta name="description" content="Comics for developers" />
      </Head>

      <Layout>
        <section className="max-w-lg m-auto">
          <h1 className="font-bold text-center mb-4 text-xl">{title}</h1>
          <div className="max-w-sm m-auto mb-4 ">
            <Image width={width} height={height} src={img} alt={alt} />
          </div>

          <p>{alt}</p>
          <div className="flex justify-between mt-4 font-bold">
            {hasPrevious && (
              <Link
                className="text-gray-600"
                href="/comic/[id]"
                as={`/comic/${prevId}`}
              >
                ⬅Previous
              </Link>
            )}
            {hasNext && (
              <Link
                className="text-gray-600"
                href="/comic/[id]"
                as={`/comic/${nextId}`}
              >
                Next➡
              </Link>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}

//Devolvemos cuando es que debemos generar una pagina estatica.
export async function getStaticPaths({locales}) {
  const files = await fs.readdir("./comics"); //OPCION SUPER RAPIDA PARA LEER
  let paths = []  // CONE STO TENDRIAMOS LOS PATHS EN ESPAÑOL Y EN INGLES
  locales.forEach(locale => {
    paths = paths.concat(files.map((file) => {
      const id = basename(file, ".json");
      return {
        params: { id },
        locale
      }
      }))
  })

  return {
    paths,
    fallback: false, // SE EJECUTA EN EL BACKGROUND CUANDO ES TRUE / SI LA ID NO ESTA CREADA, LA PAG NO EXISTE /
  };
}
//Aca no necesitamos leer todo el directorio porque ya lo sabemos con la id = params.
//LA ID ES DINAMICA Y NO SABE CUAL TIENE QUE CREAR. Necesitar saber en base a que tiene que crearlas
//SE EJECUTA EN BUILD TIME - NPM RUN BUILD
export async function getStaticProps({ params }) {
  // opcion1
  const { id } = params; // recuperamos el id
  const content = await readFile(`./comics/${id}.json`, "utf8");
  const comic = JSON.parse(content);

  const idNumber = +id;
  const prevId = idNumber - 1;
  const nextId = idNumber + 1;
  //Si existe o no un archivo fisicamente
  const [prevResult, nextResult] = await Promise.allSettled([
    //USAMOS PROMISE ALL SETTLED PORQUE PUEDEN HABER ERRORES CON ALGUNOS ARCHIVOS PERO CON OTROS NO
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`),
  ]);
  const hasPrevious = prevResult.status === "fulfilled";
  const hasNext = nextResult.status === "fulfilled";

  //opcion 2: Realizar esto generara todas las paginas "2800" cada vez que hagamos el npm run build o sea esa cantidad de fetch - Es preferible que las descarguemos una vez
  //y que no sea necesario hacer un fetch cada vez que haga la build - SCRAPPER
  // const res = await fetch(`https://xkcd.com/${id}/info.0.json`)
  // const json = await res.json()
  // console.log(json)

  return {
    props: {
      ...comic,
      hasPrevious,
      hasNext,
      nextId,
      prevId,
    },
  };
}
