import Flight from '../models/Flight';

class FlightController {
  store(flightData) {
    Flight.create(flightData);
  }
}

export default new FlightController();
