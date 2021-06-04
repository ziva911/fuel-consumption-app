# Fuel Consumption App

## Student project

Project for student exam on [Singidunum University], school year 2020/2021

## Repository Content

This repository contains source code for an app that tracks nad calculates vehicle fuel consumption.
Github repository with source code, can be found [here](https://github.com/ziva911/fuel-consumption-app.git).

- Directory [api](./api) contains source code for Node.js back end app (API)
- Directory [frontend](./frontend) contains source code for React.js single page front end application.
- Directory [documentation](./documentation/README.md) contains project documentation for this project, project theme text (/w project requirements), database model etc.

## DB Documentation

- Directory [documentation](./documentation/Database-Model.md) also contains documentation files with use case diagram, database model, database entity relations diagram and specific information about every table in db.

## Resources

- Directory [resources](./resources) contains resources required for project building, including SQL dump with database demo data, example login credentials etc.

## Graphic UI

- Directory [Graphic UI](./resources/Graphic_UI) contains simple sketches of example for application UI.

## Postman collection

- Directory [resources](./resources) also contains Postman collection for importing and testing application API.

## Building manual

Building and running app is being done in 3 steps:

1. Prepare MySQL/MariaDB database and import 'up to date' data from SQL dump database
2. Start backend app from inside api directory by running npm run dev
3. Start frontend app from inside frontend directory by running npm start
