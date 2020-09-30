/* eslint-disable no-await-in-loop */
import { addDays, differenceInMinutes, format, parseISO } from 'date-fns';
import { ADD_DAYS, LIMIT_DATA } from '../config/constants';
import api from '../services/api';
import auth from '../services/auth';

import FlightController from '../app/controllers/FlightController';
import Flight from '../app/models/Flight';

// Função para calcular a distância entre 2 pontos
function haversineDistance(coords1, coords2) {
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

function deleteElement(arr, val) {
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

function getAllCombinations(airports) {
  const arr = Object.keys(airports).map((i) => i);
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

async function findMissingFlights(airports) {
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

export default async function feedDatabase() {
  const { data: airports } = await api.get(`airports/${auth.key}`, { auth });

  const allCombinations = getAllCombinations(airports);
  const missingFlights = await findMissingFlights(allCombinations);

  // Adiciona 40 dias da data atual
  const targetDate = addDays(new Date(), ADD_DAYS);
  // Formata a data recebida para usar na api
  const formattedDate = format(targetDate, 'yyyy-MM-dd');

  // Itera o array de vôos faltando para montar e inserir no banco de dados
  missingFlights.forEach(async (flight) => {
    // Key = IATA
    const { departureKey, arrivalKey } = flight;
    const buildedUrl = `search/${auth.key}/${departureKey}/${arrivalKey}/${formattedDate}`;
    const { data } = await api.get(buildedUrl, { auth });

    const { options, summary } = data;
    const { from, to } = summary;

    // Caso não haja vôos disponíveis
    if (options.length === 0) return;

    const coords1 = { lat: from.lat, lon: from.lon };
    const coords2 = { lat: to.lat, lon: to.lon };
    const distance = haversineDistance(coords1, coords2);
    const lowestPrice = Math.min(...options.map((l) => l.fare_price));

    const {
      fare_price,
      departure_time,
      arrival_time,
      aircraft: { model, manufacturer },
    } = options.find((k) => k.fare_price === lowestPrice);

    const pricePerKm = (fare_price / distance).toFixed(3);
    const flightDuration = differenceInMinutes(
      parseISO(arrival_time),
      parseISO(departure_time)
    );
    const durationInHours = flightDuration / 60;
    const averageSpeed = (distance / durationInHours).toFixed(2);
    const dataFlight = {
      url: `http://stub.2xt.com.br/air/${buildedUrl}`,
      lowest_price: fare_price,
      distance,
      aircraft_model: model,
      aircraft_manufacturer: manufacturer,
      price_per_km: pricePerKm,
      arrival_iata: to.iata,
      departure_iata: from.iata,
      flight_duration: flightDuration,
      average_speed: averageSpeed,
    };

    FlightController.store(dataFlight);
  });
}
