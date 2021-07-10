const _ = require('lodash');
const { Card, validateCard,generateBizNumber } = require('../models/modelCards');
const { User } = require('../models/modelUser')


exports.getAllCards = async (req, res) => {   
   try{
      if (!req.user.biz) return res.status(401).send('Access denied.');
      const cards = await Card.find({ user_id: req.user._id });
      res.send(cards);
   }
   catch{
      return res.status(404).send('The card with the given ID was not found - getAllCards')}          
}

exports.newCard = async (req, res) => {
      const { error } = validateCard(req.body);
      if (error) {
         console.log(error.details[0].message);
         return res.status(400).send(error.details[0].message);
      }
      let card = new Card 
      ({
         bizName: req.body.bizName,
         bizDescription: req.body.bizDescription,
         bizAddress: req.body.bizAddress,
         bizPhone: req.body.bizPhone,
         bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
         bizNumber: await generateBizNumber(Card),
         user_id: req.user._id, 
         favorite: req.body.favorite ? req.body.favorite : false,
      })
      
      const cardlist = await fillCards(req.user._id, card.bizNumber)
      const  user = await User.findById(req.user._id);
      user.cards = [...cardlist];
      try {
         const userNew = await User.findOneAndUpdate({_id:req.user._id}, {'cards':cardlist});
         await userNew.save();
      }
      catch{
         return res.status(404).send('The card with the given ID was not found.')
      }
      const post=await card.save()
      res.send(post)
 }

exports.getCardById = async (req, res) => {
   try{
      const card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
      res.send(card);
   }
   catch{
      return res.status(404).send('The card with the given ID was not found.')}          
}

exports.deleteCard = async (req, res) => {
   try {
     const card=await Card.deleteOne({ _id: req.params.id, user_id: req.user._id });
     res.send(card);
   }
   catch{
      return res.status(404).send('The card with the given ID was not found.')}
}

exports.putCard = async (req, res) => {
   const { error } = validateCard(req.body);
   if (error) return res.status(400).send(error.details[0].message);
   try {
     const card = await Card.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id },req.body);        
     const newCard = await Card.findOne({ _id: req.params.id});        
     res.send(newCard);
   } catch {
     return res.status(404).send('The card with the given ID was not found.')}
}


async function fillCards(userId, newCard) {
   const arrCards = await Card.find({ user_id: userId});
   let cardList = arrCards.reduce((total, value) => {
      total.push(+value.bizNumber) 
      return total
   },[])
   cardList.push(+newCard)
   return cardList
}