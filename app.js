const express = require("express");
const app = express();

const jwt = require('jsonwebtoken');
const users = require("./users");

app.listen(3000, () => {
    console.log("http://localhost:3000")
    console.log('Authentification service started on port 3000')
});

app.use(express.json());


const accessTokenSecret = 'bf833a0ace20433ed4ae322b701d4925';

app.post('/login', ((req, res) => {
    const {username, password} = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const accessToken = jwt.sign({username: user.username, role: user.role}, accessTokenSecret);

        res.json({accessToken});
    } else {
        res.send('Username or password incorrect.')
    }
}));






