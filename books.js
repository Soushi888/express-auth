const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./data/books');

const app = express();

app.use(express.json());

app.listen(4000, () => {
    console.log('http://localhost:4000');
    console.log('Books service started on port 4000')
});

const accessTokenSecret = 'bf833a0ace20433ed4ae322b701d4925';

// Authentification middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) return res.sendStatus(403);

            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401);
    }
}

app.get("/books", authenticateJWT, (req, res) => {
    res.json(books);
});

app.post("/book", authenticateJWT, (req, res) => {
    const {role} = req.user;

    console.log(req.user)

    if (role !== "admin") return res.sendStatus(403);

    const book = req.body;
    books.push(book);

    res.send('Book added successfully.');
})