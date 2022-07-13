const handleImage = (req, res, db) => {
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
}

module.exports = {
    handleImage
}