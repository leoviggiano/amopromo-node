import Flight from '../models/Flight';

class FlightController {
  store(flightData) {
    Flight.create(flightData);
  }

  lastFlight() {
    return Flight.findAll({ limit: 1, order: [['created_at', 'DESC']] });
  }
}

export default new FlightController();
