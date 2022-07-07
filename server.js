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

const database = {
    users:[
        {
            id: '123',
            name: 'John',
            email:'john@gmail.com',
            password:'cookies',
            entries:0,
            lasturl: 'saÍ',
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email:'sally@gmail.com',
            password:'cheerful',
            entries:0,
            lasturl: '',
            joined: new Date()
        }
    ],
    logins:[
        {
            id: '987',
            hash:'',
            email:'john@gmail.com' 
        }
    ]
}

app.get('/', (req, res) => {
    res.json(database.users)
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (id === user.id) {
            found = true;
            return res.json(user);
        }
    })

    if (!found) {
        res.status(400).json('No user found!');
    }
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0])
    } else {
        res.status(400).json('Error when logging in')
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    db('users')
        .returning('*') //insert new user and return all the columns.
        .insert({
            name: name,
            email: email,
            entries: 0,
            // lasturl: '',
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('Unable to register'));
});

app.put('/image', (req, res) => {
    const { id, lasturl } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (id === user.id) {
            user.entries++;
            user.lasturl = lasturl;
            
            return res.json(user);
        }
    });
    if (!found) {
        res.status(400).json('No user found!');
    }
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