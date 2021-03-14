# Pastry shop - Backend

## Dependencies and libraries used

- [Express](https://expressjs.com/)
- [Mongodb](https://www.mongodb.com)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [JsonWebToken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

## Application Structure

- `index.js` - The entry point of application.
- `constants/` - This folder contains constants declaration.
- `models/` - This folder contains the schema definitions of Mongoose models.
- `routes/` - This folder contains the route definitions of API.
- `utils/` - This folder contains utils functions.


### API Endpoints

List of available routes:

**Register admin routes**:\
`POST /api/register` - create admin user\
Required
- `email` (string)
- `password` (string)

**Login admin routes**:\
`POST /api/login` - login admin user\
Required
- `email` (string)
- `password` (string)

**Recipe routes**:\
`GET /api/recipes` - get recipes\
`POST /api/recipes` - create new one recipe (only Admin)\
Required
- `email` (string)
- `password` (string)
- HEADERS
  - `Content-Type: application/json` (required for posting JSON)\
`PATCH /api/recipes/:id` - update recipe properties (only Admin)\
`DELETE /api/recipes/:id` - Delete recipe (only Admin)

**Ingredients routes**:\
`GET /api/ingredients` - get list of all ingredients