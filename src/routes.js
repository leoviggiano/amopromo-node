import { Router } from 'express';
import AirportController from './app/controllers/AirportController';
import FlightController from './app/controllers/FlightController';
import SeedController from './app/controllers/SeedController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ teste: 'ok' });
});

// Airport
routes.get('/airport/cities/count', AirportController.countAirportsByCities);
routes.get('/airport/flights', AirportController.showAllAirportsWithDestiny);

// Flights
routes.get('/flights', FlightController.showOrderedByFlightDuration);

// Seeds
routes.post('/seeds/flights', SeedController.storeFlights);
routes.post('/seeds/airports', SeedController.storeAirports);

export default routes;
