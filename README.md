# BandVZ frontend

## Prerequisites
* Node.js 24.10.0
* NPM 11.6.1

# Local installation
* Clone the repository
* Change to project folder
* Copy `cp .env.sample .env`. Edit the configuration data
* Edit `openapi-ts.config.ts`. Change the `input` property to where the  `swagger.json` is in the backend. You can also specify a URL. The URL must be the URL of the backend.
* Run `npm install` to install needes packages.
* Run `npx openapi-ts` to generate the API services from the `swagger.json` in the backend.
* Run `mkdir storage`, `mkdir storage/bandimgs` and `mkdir storage/tracks` to create storage directories.
* Run `npm run dev`

## Development commands

### Generate API code
* `npx openapi-ts`

### Run the development server
* `npm run dev`
