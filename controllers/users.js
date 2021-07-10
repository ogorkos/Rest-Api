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
   const user = await User.findById(req.user._id).select('-password')   
   res.send(user)
}


const getCards = async (cardsArray) => {
   try{
      const cards = await Card.find({ "bizNumber": { $in: cardsArray } });
      return cards;
   }
   catch {
      res.status(400).send("Card numbers don't match");
   }   
 };
  

 exports.getCardsUser = async (req, res) => {
   if (!req.query.numbers) res.status(400).send("Missing numbers");
   try {
      const cards = await getCards(req.query.numbers.split(","));
      res.send(cards)       
   }
   catch {
      res.status(400).send("Card numbers don't match");
   }   
 };


 exports.putUser = async (req, res) => {
    console.log(req.body);
   const { error } = validationUser(req.body);
   if (error) return res.status(400).send(error.details[0].message);
   try {
     await User.findOneAndUpdate({ _id: req.params.id },req.body);       
     const newUser = await User.findOne({ _id: req.params.id});        
     console.log(newUser);
     res.send(newUser);
   } catch {
     return res.status(404).send('The User with the given ID was not found.')}
}



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


