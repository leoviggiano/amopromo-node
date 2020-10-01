# How to Setup - Node Application
```sh
    $ git clone
    $ cd to folder
    $ yarn
    $ docker-compose up -d
    $ yarn sequelize db:migrate
    $ yarn dev
```
# Rotas:

## Airports
  - /airports/distance - **GET**
        - Rota definida para recuperar os aeroportos mais distante e mais perto

- /airports/count - **GET**
        - Rota definida para recuperar a quantidade de aeroporto por cidade

- /airports/seeds - **POST**
        - Rota definida para preencher o bacno de dados com os aeroportos disponibilizados

## Flights
- /flights/duration - **GET**
        - Rota definida para recuperar a duração do vôo, modelo de aeronave, local e destino. É ordenada pela duração do vôo de forma decrescente

- /flights/seeds - **POST**
        - Rota definida para preencher o banco de dados com os dados de vôos disponibilizados
        - Nota: Só é possível depois de preencher a tabela Airports
