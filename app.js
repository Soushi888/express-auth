const express = require("express");
const app = express();

const jwt = require('jsonwebtoken');
const users = require("./data/users");

app.listen(3000, () => {
    console.log('Authentification service started on port 3000')
});

app.use(express.json());


const accessTokenSecret = 'bf833a0ace20433ed4ae322b701d4925';
const refreshTokenSecret = "a36e982ff4143502fb33a346d1de588c";

let refreshTokens = [];


app.post('/login', ((req, res) => {
    // read username and password from request body
    const {username, password} = req.body;

    // filter user from the users array by username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({username: user.username, role: user.role}, accessTokenSecret);
        const refreshToken = jwt.sign({username: user.username, role: user.role}, refreshTokenSecret);

        refreshTokens.push(refreshToken);

        res.json({accessToken, refreshToken});
    } else {
        res.send('Username or password incorrect.')
    }
}));

app.post("/token", (req, res) => {
    const {token} = req.body;

    if (!token) return res.sendStatus(401);

    if (!refreshTokens.includes((token))) return res.sendStatus(403);

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign({
            username: user.username,
            role: user.role
        }, accessTokenSecret, {expirationTime: "20m"})

        res.json({accessToken})
    });
})

app.post("/logout", ((req, res) => {
    const {token} = req.body;

    refreshTokens = refreshTokens.filter(t => t !== token);

    res.send("Logout successful.");
}))






