const PORT = 3000;
const DB_URL = 'mongodb+srv://adminDb:danielam83@cluster0-opcep.mongodb.net/PastryShop?retryWrites=true&w=majority&ssl=true';
const JWT_SECRET_KEY = 'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHWPwsQpwtTwUDNPJJoGXTQ+J6qE5GwIn+/NRc3rs/NnDb8lsQS9OfcVtiEQCfOuwxtf9U2/NBhd1wNknGHmWA4HeNEm5qOsGIOJ2JW1l9UfsZU0mTaeYkRrHcRyu/DySDaFyYxNa9EZvqdSI6XPha3Z4a7lj8B2+vkW8xKlZjfbAgMBAAE=';

module.exports = {
    PORT,
    DB_URL,
    JWT_SECRET_KEY
};