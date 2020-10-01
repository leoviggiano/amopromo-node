import Flight from '../models/Flight';

class FlightController {
  async store(flightData) {
    return Flight.create(flightData);
  }

  async showOrderedByFlightDuration(req, res) {
    const { limit = 30 } = req.body;
    const flights = await Flight.findAll({
      order: [['flight_duration', 'DESC']],
      attributes: [
        'flight_duration',
        'aircraft_manufacturer',
        'aircraft_model',
        'departure_iata',
        'arrival_iata',
      ],
      limit,
    });

    return res.status(200).json(flights);
  }

  /**
   *
   * @param {Object} options
   * Recebe IATA para procurar
   * OrderBy para ordenar
   */
  searchFlight(options) {
    const { iata, orderBy } = options;

    return Flight.findAll({
      where: { departure_iata: iata },
      order: [['distance', orderBy]],
      limit: 1,
    });
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
