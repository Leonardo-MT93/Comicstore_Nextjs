import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export function Header() {
  const [results, setResults] = useState([]);
  const searchRef = useRef();
  const {locale,locales} = useRouter()



  const getValue = () => searchRef.current?.value;
  const handleChange = () => {
    const q = getValue()
    if(!q) return
    fetch(`/api/search?q=${q}`)
      .then((res) => res.json())
      .then((searchResults) => {
        setResults(searchResults);
      });
  };

  const restOfLocales = locales.filter(l => l != locale)



  return (
    <header className="flex justify-between items-center p-4 max-w-xl m-auto">
      <h1 className="font-bold">
        <Link href="/" className="transition hover: opacity-80">
          <h1>
            next<span className="font-light">xkcd</span>
          </h1>
        </Link>
      </h1>

      <nav>
        <ul className="flex flex-row gap-2">
          <li>
            <Link href="/" className="text-sm font-semibold">
              Home
            </Link>
          </li>

          {/* Ejemplo para que figure el idioma */}
          <li>
            <Link href='/' locale={restOfLocales[0]} className="text-sm font-semibold">
            {restOfLocales[0]}
            </Link>
          </li>

          <li>
            <input
              ref={searchRef}
              type="search"
              onChange={handleChange}
              className="px-4 py-1
           border-gray-400 rounded-3xl text-xs"
            />
            <div className="relative z-10">
              {Boolean(results.length) && (
                <div className="absolute top-0 left-0">
                  <ul className="w-full border-gray-50 rounded-lg shadow-sm bg-white z-50 overflow-hidden">

                  <li key='all-results' className=" m-0">
                          <Link
                            href={`/search?q=${getValue()}`}
                            className="text-gray-400 overflow-hidden block text-ellipsis whitespace-nowrap italic text-sm font-semibold hover: bg-slate-200 px-2 py-1"
                          >
                            Ver {results.length} resultados
                          </Link>
                        </li>

                    {results.map((result) => {
                      return (
                        <li key={result.id} className=" m-0">
                          <Link
                            href={`/comic/${result.id}`}
                            className="text-sm font-semibold hover: bg-slate-200 px-2 py-1"
                          >
                            {result.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
