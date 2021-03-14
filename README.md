# Pastry shop - Backend

## Dependencies and libraries used

- [Express](https://expressjs.com/)
- [Mongodb](https://www.mongodb.com)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [JsonWebToken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](hhttps://www.npmjs.com/package/bcrypt)

## Application Structure

- `index.js` - The entry point of application.
- `constants/` - This folder contains constants declaration.
- `models/` - This folder contains the schema definitions of Mongoose models.
- `routes/` - This folder contains the route definitions of API.
- `utils/` - This folder contains utils functions.


### API Endpoints

List of available routes:

**Register admin route**:\
`POST /api/register` - create admin user\

**Login admin route**:\
`POST /api/login` - login admin user\

**Recipe routes**:\
`GET /api/recipes` - get recipes\
`POST /api/recipes` - create new one recipe\
`PATCH /api/recipes` - update recipe properties\
`DELETE /api/recipes` - Delete recipe\

**Ingredients route**:\
`GET /api/ingredients` - get list of all ingredients\