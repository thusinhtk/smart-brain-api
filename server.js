const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email:'sally@gmail.com',
            password:'cheerful',
            entries:0,
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
        res.json('success');
    } else {
        res.status(400).json('Error when logging in')
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });

    // res.status(200).json('Registered successfully');
    res.json(database.users[database.users.length - 1]);
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (id === user.id) {
            user.entries++;
            return res.json(user.entries);
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