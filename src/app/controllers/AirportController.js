import Airport from '../models/Airport';

class AirportController {
  async store(airportData) {
    const { iata } = airportData;
    const hasAirport = await Airport.findByPk(iata);
    if (hasAirport) return;

    Airport.create(airportData);
  }
}

export default new AirportController();
