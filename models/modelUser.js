const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const schemaUser = new mongoose.Schema({
   username: {
      type: String, 
      minlength:2,
      maxlength:100,
      required: true
   },
   email: {
      type: String,
      minlength:6,
      maxlength:200,
      required: true,
      unique: true
   },
   password: {
      type: String,
      minlength: 6,
      maxlength: 100, 
      required: true
   },
   biz: {
      type: Boolean,
      required: true
   },
   cards: { type: Array},
   birthYear: { type: Number },
   dateCreate: { type: Date, default: Date.now }
 });

 schemaUser.methods.generateAuthToken = function () {
   // console.log(process.env.mySecretPassword);
   const token = jwt.sign({ _id: this._id, biz: this.biz }, process.env.mySecretPassword);
   // console.log('token = ', token);
   const decoded = jwt.verify( token, process.env.mySecretPassword);
   // console.log(decoded);
   return token;
 }

const User = mongoose.model('User', schemaUser);



function validationUser(user) {
   const  schema = Joi.object({
      username: Joi.string()
          .alphanum()
          .min(3)
          .max(30)
          .required(),
  
      email: Joi.string()
          .email({ minDomainSegments: 2 })
          .min(6)
          .max(100)
          .required(),
      
      password: Joi.string()
          .min(6)
          .max(1024)
          .required(),
  
      biz: Joi.boolean()
          .required(),
  
      birthYear: Joi.number()
          .integer()
          .min(1900)
          .max(2015)        
  })
  console.log('schema.validate = ',schema.validate(user));
  return schema.validate(user)
}



function validateUserAndPassword(req) { 
   const schema = Joi.object({
     email: Joi.string()
         .min(6)
         .max(100)
         .required()
         .email(),
     password: Joi.string()
         .min(6)
         .max(1024)
         .required()
   });
  
   return schema.validate(req);
}




exports.User = User;
exports.validationUser = validationUser;
exports.validateUserAndPassword = validateUserAndPassword;