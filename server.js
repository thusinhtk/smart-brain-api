const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg', /* pg: postgreSQL */
    connection: {
        host: '127.0.0.1',
        port: 5432, //3306
        user: 'minhphuong',
        password: '',
        database: 'smart-brain'
    }
});

const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.json('Sucess') });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/signin', signin.handleSignin(db, bcrypt)); // way 2: req, res automatically received
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.listen(3000, () => {
    console.log('app is running on port 3000');
});