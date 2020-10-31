# hackbox_client
The front-end of the Hackbox webapp.
Built using React and NextJS.

## Setup
1. `npm install`
2. Create a .env file in this directory, and set the `API_URL`.
Example:
```
API_URL=https://hackbox_api.example.com
```
3. Change the port inside of `package.json` to whatever port you want the front-end to listen on.
4. Run `npm run-script dev` to start the development server, or `npm run-script build && npm run-script start` to build the app and start the production server.

## License
The front-end is based off of the [NextJS Argon Dashboard](https://www.creative-tim.com/product/nextjs-argon-dashboard) by Creative Tim, licensed under the MIT [LICENSE](LICENSE).
