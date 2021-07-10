// const express = require('express');
// const router = express.Router();
// const auth = require('./../middleware/auth')
const { User, validationUser } = require('../models/modelUser')
const bcrypt = require('bcrypt'); 
const _ = require('lodash');
const { Card } = require('../models/modelCards')
const { validateCards } = require('../validation/validateCards')


exports.createUser = async (req, res) => {
   console.log('req.body = ', req.body);
   const {error} = validationUser(req.body)
   if (error) {
      console.log(error.details[0].message);
      return res.status(400).send(error.details[0].message) }
   
   const user = await User.findOne({email:req.body.email})
   if (user) {
      return res.status(400).send(`Email ${req.body.email} already registred`)   }

   const userToSave = new User(req.body)
   const saltRounds = 8;
   const hashPassword = bcrypt.hashSync(userToSave.password, saltRounds);
   userToSave.password = hashPassword;

   userToSave.save()
   .then(() =>  {      
      return res.status(200).send(_.pick(userToSave, ["_id", "username", "email"]))
   })
   .catch(err => res.status(400).send(err))
}


exports.findUserById =  async (req, res) => {
   // console.log(req);
   const user = await User.findById(req.user._id).select('-password')
   console.log('cards = ', user.cards);
   res.send(user)
}


const getCards = async (cardsArray) => {
   // console.log('cardsArray', cardsArray);
   try{
      const cards = await Card.find({ "bizNumber": { $in: cardsArray } });
      return cards;
   }
   catch {
      res.status(400).send("Card numbers don't match");
   }   
 };
  

 exports.getUser = async (req, res) => {
   if (!req.query.numbers) res.status(400).send("Missing numbers");
   try {
      const cards = await getCards(req.query.numbers.split(","));
      res.send(cards)       
   }
   catch {
      res.status(400).send("Card numbers don't match");
   }   
 };


 exports.patchUserCards = async (req, res) => {
  
   const { error } = validateCards(req.body);
   if (error) res.status(400).send(error.details[0].message);
  
   const cards = await getCards(req.body.cards);
   if (cards.length != req.body.cards.length) res.status(400).send("Card numbers don't match");
  
   let user = await User.findById(req.user._id);
   user.cards = req.body.cards;
   user = await user.save();
   res.send(user);
  
 };


