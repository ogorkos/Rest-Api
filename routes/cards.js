const express = require('express');
// const _ = require('lodash');
// const { Card, validateCard,generateBizNumber } = require('../models/modelCards');
const auth = require('../middleware/auth');
const router = express.Router();
// const { User } = require('../models/modelUser')
const { newCard, getCardById, deleteCard, putCard, getAllCards } = require('../controllers/cards.js')

router.post('/', auth, newCard);
router.get('/my-cards', auth, getAllCards)
router.get('/:id', auth, getCardById)
router.delete('/:id', auth, deleteCard)
router.put('/:id', auth, putCard)


module.exports = router;