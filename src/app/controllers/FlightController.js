import Flight from '../models/Flight';

class FlightController {
  store(flightData) {
    Flight.create(flightData);
  }

  highestDuration(quantity) {
    return Flight.findAll({
      limit: quantity,
      order: [['flight_duration', 'DESC']],
    });
  }

  lastFlight() {
    return Flight.findAll({ limit: 1, order: [['created_at', 'DESC']] });
  }
}

export default new FlightController();
