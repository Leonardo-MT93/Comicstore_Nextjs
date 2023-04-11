import Head from "next/head";
import { Header } from "@/components/Header";
import fs from "fs/promises";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import Layout from "@/components/Layout";
import { useI18N } from "@/context/i18n";

export default function Home({ latestComics }) {
  const {t} = useI18N()

  return (
    <>
      <Head>
        <title>Comics x developers</title>
        <meta name="description" content="Comics for developers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <h2 className="text-3xl font-bold text-center mb-10">{t('LATEST_COMICS')}</h2>
        <section className="grid grid-cols-1 gap-2 max-w-md m-auto sm:grid-cols-2 md:grid-cols-3">
          {latestComics.map((comic) => {
            return (
              <Link
                className="mb-4 pb-4 m-auto"
                href={`/comic/${comic.id}`}
                key={comic.id}
              >
                <h3 className="font-bold text-sm text-center pb-2">
                  {comic.title}
                </h3>
                <Image
                  className="aspect-square"
                  width={comic.width}
                  height={comic.height}
                  src={comic.img}
                  alt={comic.alt}
                />
              </Link>
            );
          })}
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps(context) {
  //OBTENEMOS UN ARRAY CON LOS ULTIMOS COMICS
  const files = await fs.readdir("./comics");
  const latestComicsFiles = files.slice(-8, files.length);
  const promisesReadFiles = latestComicsFiles.map(async (file) => {
    const content = await fs.readFile(`./comics/${file}`, "utf8");
    return JSON.parse(content);
  });
  const latestComics = await Promise.all(promisesReadFiles);
  return {
    props: {
      latestComics,
    },
  };
}
