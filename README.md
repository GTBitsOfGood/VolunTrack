# Bits of Good - Volunteer Management Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/GTBitsOfGood/drawchange.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/GTBitsOfGood/drawchange)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a24becd2bcb24408a7f35265306512e7)](https://app.codacy.com/app/GTBitsOfGood/drawchange?utm_source=github.com&utm_medium=referral&utm_content=GTBitsOfGood/drawchange&utm_campaign=Badge_Grade_Dashboard)
[![Known Vulnerabilities](https://snyk.io/test/github/gtbitsofgood/drawchange/badge.svg)](https://snyk.io/test/github/gtbitsofgood/drawchange)

# How to run:

1. Clone the repository.

2. Copy the .env file from the slack channel into the backend folder

3. Navigate to the backend folder through the terminal and run

### `yarn install`

and then

### `yarn dev`

This should start the backend server and connect to the MongoDB Database.

4. Navigate to the frontend folder on a new terminal window and run

### `yarn install`

and then

### `yarn start`

A browser window should open http://localhost:3000/

## IMPORTANT DEVELOPMENT INFORMATION

-   Authentication is disabled when the `NODE_ENV` environment variable is set to `development`. You can configure this in the `backend/.env` file.
