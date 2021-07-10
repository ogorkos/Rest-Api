const Joi = require("joi")

function validateCards(data) {
   const shemaCards = Joi.object({
      cards:Joi.array()
         .min(1)
         .required()  
   })
   return shemaCards.validate(data)
}


exports.validateCards = validateCards;