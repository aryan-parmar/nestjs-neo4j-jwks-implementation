const express = require('express');
const app = express();
const port = 4000;
const jwksRsa = require('jwks-rsa');
const {expressjwt: jwt} = require('express-jwt');

app.use(express.json());
app.use(
    jwt({
        secret: jwksRsa.expressJwtSecret({
            jwksUri: 'http://localhost:3000/.well-known/jwks.json',
            cache: true,
            rateLimit: true,
        }),
        algorithms: ['RS256']
    })
)
// This is the public key that will be used to verify the JWT signature
app.get('/help', (req, res) => {
    jwksRsa
    res.send('Hello World!');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));