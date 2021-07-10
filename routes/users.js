const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth')
const { createUser, findUserById, getCardsUser, patchUserCards, putUser } = require('../controllers/users.js')


router.post('/create', createUser)

router.get('/cards', auth,getCardsUser)

router.get('/me', auth,  findUserById)

router.put('/:id', auth, putUser)

router.patch('/cards', auth, patchUserCards);



module.exports = router