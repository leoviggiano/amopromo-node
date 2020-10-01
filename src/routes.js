import { Router } from 'express';
import AirportController from './app/controllers/AirportController';
import FlightController from './app/controllers/FlightController';
import SeedController from './app/controllers/SeedController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ teste: 'ok' });
});

// Airport
routes.get('/airports/count', AirportController.countAirportsByCities);
routes.get('/airports/distance', AirportController.showAllAirportsWithDestiny);

// Flights
routes.get('/flights/duration', FlightController.showOrderedByFlightDuration);

// Seeds
routes.post('/flights/seeds', SeedController.storeFlights);
routes.post('/airports/seeds', SeedController.storeAirports);

export default routes;
