const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');


 
function validateCard(card) {
 
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizPhone: Joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
    bizImage: Joi.string().min(11).max(1024)
  });
 
  return schema.validate(card);
}
async function generateBizNumber(Card) { 
    while (true) {        
      let randomNumber = _.random(1000, 999999);
      let card = await Card.findOne({ bizNumber: randomNumber });
      if (!card) return String(randomNumber);
    }
}
 
exports.validateCard = validateCard;
exports.generateBizNumber = generateBizNumber;