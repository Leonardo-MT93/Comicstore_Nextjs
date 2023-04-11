import algoliasearch from 'algoliasearch';
const APP_ID = process.env.APP_ID
const API_KEY = process.env.API_KEY
const client = algoliasearch(APP_ID, API_KEY);
  const index = client.initIndex('prod_comics');

  const CACHE = {}

  export const search = async ({query}) => {
    //Primero realiza la busqueda en cache si esta guardada
    if(CACHE[query]) return{results: CACHE[query]}

    const {hits} = await index.search(query, {
        hitsPerPage: 10,
        attributesToRetrieve: ['id', 'title', 'img', 'alt']
      })

      CACHE[query] = hits;

      //Solo funcionaria en la misma sesion de navegacion del usuario
      return {results : hits}
  }