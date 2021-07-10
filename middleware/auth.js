const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {

   const token = req.header('token');

   if ( !token ) return res.status(400).send('Access denied. No token provided.')

   try {
      const decoded = jwt.verify( token, process.env.mySecretPassword);
      req.user = decoded;      
      next();
   }
   catch (err) {
      res.status(400).send('Invalid token')
   }
}