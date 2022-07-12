const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json('Sucess');
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                return res.json(user[0]);
            } else {
                res.status(400).json('Not found!');
            }
        })
        .catch(err => res.status(400).json('Error getting user!'));
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', data[0].email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unalbe to get User'))
            }
            else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*') //insert new user and return all the columns.
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    entries: 0,
                    lasturl: '',
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json('Unable to register'));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
});

app.put('/image', (req, res) => {
    const { id, lasturl } = req.body;

    // Using knex
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => {
            res.status(400).json('Unable to get count');
        });
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });