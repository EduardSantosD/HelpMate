require('dotenv').config({ path: '../.env' })
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cloudant = require('@cloudant/cloudant');

const { validate_login } = require('../classes/validators');

router.post('/', async (req, res) => {
    const { error } = validate_login(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');

    const query_response = await users_db.find({ selector: { email: { "$eq": req.body.email } } });
    if (!query_response.docs[0]) return res.status(404).send('Error: incorrect username or password.');

    const user = query_response.docs[0];
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send('Error: incorrect username or password.');

    const token = await jwt.sign({ _id: user._id }, process.env.SECRET);

    res.status(200).send({ xauthtoken: token });
});

module.exports = router;