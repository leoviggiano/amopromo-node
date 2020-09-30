import sequelize from 'sequelize';
import Airport from '../models/Airport';

class AirportController {
  async store(airportData) {
    const { iata } = airportData;
    const hasAirport = await Airport.findOne({ where: { iata } });
    if (hasAirport) return;
    Airport.create(airportData);
  }

  storeAll(airports) {
    const allAirports = Object.values(airports);
    allAirports.forEach((airport) => {
      this.store(airport);
    });
  }

  countAirportsByCities(limit = 1) {
    /**
     * Attributes é basicamente as colunas que serão geradas, então estou querendo visualizar as colunas "city" e "count",
     * Sendo que a coluna 'count' recebe a função 'count' que atua na coluna 'city'
     *
     * Group agrupará a coluna "city"
     * Order foi utilizado para ordernar em quantidade decrescente a coluna "count"
     * E limit é limitar a consulta para X resultados
     */

    return Airport.findAll({
      attributes: [
        'city',
        [sequelize.fn('count', sequelize.col('city')), 'count'],
      ],
      group: ['city'],
      order: [['count', 'DESC']],
      limit,
    });
  }
}

export default new AirportController();
