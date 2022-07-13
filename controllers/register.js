const handleRegister = (req, res, db, bcrypt) => {
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
    })
}

module.exports ={
    handleRegister: handleRegister
}