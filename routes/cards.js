const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { newCard, getCardById, deleteCard, putCard, getAllCards } = require('../controllers/cards.js')

router.post('/', auth, newCard);
router.get('/my-cards', auth, getAllCards)
router.get('/:id', auth, getCardById)
router.delete('/:id', auth, deleteCard)
router.put('/:id', auth, putCard)


module.exports = router;