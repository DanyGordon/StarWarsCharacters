import { errorHandler } from './errorHandler.js';

const baseUrl = 'https://akabab.github.io/starwars-api/api';

const get = async (path) => {
  try {
    const res = await fetch(baseUrl + path);
    if(!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  } catch(e) {
    errorHandler(e);
    return null;
  }
};

export const getCharacters = async () => await get(`/all.json`);