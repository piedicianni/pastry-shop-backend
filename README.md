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

**Register admin routes**:

| URL           | Method | What                    |
|---------------|--------|-------------------------|
| /api/register | POST   | Create admin user       |

**Login admin routes**:

| URL           | Method | What                    |
|---------------|--------|-------------------------|
| /api/login    | POST   | Login admin user        |

**Recipe routes**:

| URL           | Method | What                             |
|---------------|--------|----------------------------------|
| /api/recipes  | GET    | Get recipes                      |
| /api/recipes  | POST   | Create new one recipe (Admin)    |
| /api/recipes  | PATCH  | Update recipe properties (Admin) |
| /api/recipes  | DELETE | Delete recipe (Admin)            |

**Ingredients routes**:

| URL                 | Method | What                        |
|---------------------|--------|-----------------------------|
| /api/ingredients    | GET    | Get list of all ingredients |