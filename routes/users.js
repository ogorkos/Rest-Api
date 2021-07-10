const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth')
const { createUser, findUserById, getUser, patchUserCards } = require('../controllers/users.js')

// const { User, validationUser } = require('../models/modelUser')
// const bcrypt = require('bcrypt'); 
// const _ = require('lodash');
// const { Card } = require('../models/modelCards')
// const { validateCards } = require('../validation/validateCards')


router.post('/create', createUser)

router.get('/me', auth,  findUserById)

router.get('/cards', auth,getUser);

router.patch('/cards', auth, patchUserCards);


module.exports = router