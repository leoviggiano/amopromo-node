/* eslint-disable no-await-in-loop */
import { LIMIT_DATA } from '../config/constants';

import Flight from '../app/models/Flight';

// Função para calcular a distância entre 2 pontos
export function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const { lat: lat1, lon: lon1 } = coords1;
  const { lat: lat2, lon: lon2 } = coords2;
  const R = 6371; // km

  const x1 = lat2 - lat1;
  const dLat = toRad(x1);
  const x2 = lon2 - lon1;
  const dLon = toRad(x2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d.toFixed(3);
}

export function deleteElement(arr, val) {
  /**
   * Tomei a decisão de usar esse método para remover pois é mais eficiente que filter/slice/splice, e estamos lidando com grande carga de valores
   *
   * 1, 2, 3 ,4 ,5 -> 3 (remover o 3)
   * 1, 2, 4, 5 (J não iterou quando achou o 3, logo ele foi sobrescrito pelo próximo, e então, seta o length = j para não haver valores repetidos)
   */

  let j = 0;
  for (let i = 0, l = arr.length; i < l; i += 1) {
    if (arr[i] !== val) {
      arr[j] = arr[i];
      j += 1;
    }
  }
  arr.length = j;
  return arr;
}

export function getAllCombinations(airports) {
  const arr = airports.map((i) => i.dataValues.iata);
  // Limitar quantidade de aeroportos
  arr.length = LIMIT_DATA;

  // IATA : [Combinações]
  const allCombinations = {};

  /**
   * Basicamente a array de aeroportos irá ser iterada, setando a IATA como chave do objeto,
   * e seu valor sendo a array copiada removendo a sua própria IATA, pois não há como o destino
   * e partida serem o iguais
   */

  arr.forEach((i) => {
    allCombinations[i] = deleteElement([...arr], i);
  });

  return allCombinations;
}

export async function findMissingFlights(airports) {
  const missingFlights = [];
  const airportsCombinations = Object.entries(airports);
  const allFlights = await Flight.findAll();

  // Iteração para verificar se existe algum campo no banco de dados com o mesmo aeroporto de chegada x saida
  airportsCombinations.forEach(([departureKey, arrivalKeys]) => {
    arrivalKeys.forEach((arrivalKey) => {
      const hasFlight = allFlights.findIndex(
        (i) =>
          i.arrival_iata === arrivalKey && i.departure_iata === departureKey
      );
      // Se não houver o voo, acrescenta na array o voo faltando.
      if (hasFlight < 0) missingFlights.push({ departureKey, arrivalKey });
    });
  });

  return missingFlights;
}
