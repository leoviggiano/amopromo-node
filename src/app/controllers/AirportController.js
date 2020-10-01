import sequelize from 'sequelize';
import Airport from '../models/Airport';
import FlightController from './FlightController';

class AirportController {
  async store(airportData) {
    const { iata } = airportData;
    const hasAirport = await Airport.findOne({ where: { iata } });

    if (hasAirport) return null;
    return Airport.create(airportData);
  }

  storeAll(airports) {
    const allAirports = Object.values(airports);
    allAirports.forEach((airport) => {
      this.store(airport);
    });
  }

  async showAllAirportsWithDestiny(req, res) {
    const allAirports = await Airport.findAll();

    const returnAirports = await Promise.all(
      allAirports.map(async (airport) => {
        const { iata } = airport;
        const highestFlight = await FlightController.searchFlight({
          iata,
          orderBy: 'DESC',
        });

        const lowestFlight = await FlightController.searchFlight({
          iata,
          orderBy: 'ASC',
        });

        const highest =
          highestFlight.length > 0
            ? highestFlight[0].arrival_iata
            : 'Não há vôo disponível';

        const lowest =
          lowestFlight.length > 0
            ? lowestFlight[0].arrival_iata
            : 'Não há vôo disponível';

        return {
          from: iata,
          highest_iata: highest,
          lowest_iata: lowest,
        };
      })
    );

    return res.status(200).json(returnAirports);
  }

  async countAirportsByCities(req, res) {
    const { limit = 1 } = req.body;
    /**
     * Attributes é basicamente as colunas que serão geradas, então estou querendo visualizar as colunas "city" e "count",
     * Sendo que a coluna 'count' recebe a função 'count' que atua na coluna 'city'
     *
     * Group agrupará a coluna "city"
     * Order foi utilizado para ordernar em quantidade decrescente a coluna "count"
     * E limit é limitar a consulta para X resultados
     */

    const airportCounting = await Airport.findAll({
      attributes: [
        'city',
        [sequelize.fn('count', sequelize.col('city')), 'count'],
      ],
      group: ['city'],
      order: [['count', 'DESC']],
      limit,
    });

    return res.status(200).json(airportCounting);
  }
}

export default new AirportController();
