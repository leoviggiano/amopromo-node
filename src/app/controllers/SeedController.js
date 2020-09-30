import { addDays, differenceInMinutes, format, parseISO } from 'date-fns';
import { ADD_DAYS } from '../../config/constants';

import {
  findMissingFlights,
  getAllCombinations,
  haversineDistance,
} from '../../utils';

import api from '../../services/api';
import auth from '../../services/auth';

import AirportController from './AirportController';
import FlightController from './FlightController';
import Airport from '../models/Airport';

class SeedController {
  async storeAirports(req, res) {
    try {
      const { data: airports } = await api.get(`airports/${auth.key}`, {
        auth,
      });
      AirportController.storeAll(airports);
      return res.status(201).json({ success: 'All Airports created' });
    } catch (e) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async storeFlights(req, res) {
    try {
      const airports = await Airport.findAll();
      if (airports.length === 0) throw Error('You must add airports first');

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
        const { data } = await api.get(buildedUrl, { auth }).catch(() => {
          throw Error('API returned empty, maybe an error in URL?');
        });

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
      return res.status(201).json({ success: 'Seeds created' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}

export default new SeedController();
