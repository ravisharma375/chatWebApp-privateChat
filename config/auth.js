const passport = require('passport')//=
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../config/db')
module.exports.serializeUser = function() {
    "use strict";
    passport.serializeUser(function(user, done) {
      console.log("serialize" , user.id)
  return    done(null, user.id);
    });
  };
//deserializer User
module.exports.deserializeUser = function() {
  "use strict";
  passport.deserializeUser(function(id, done) {
    User.findByPk(id, {})
      .then(function(user) {
        // user.token = jwt.sign({ firstName: user.firstName, emailId: user.emailId }, secret, { expiresIn: '1d' })
        done(null, user);
      })
      .catch(function(err) {
        done(err, false);
      });
  });
};
  
/**
 * Configure the strategy passport should use
 */
module.exports.configureStrategy = ()=>{
    passport.use(new LocalStrategy((userName,password,done)=>{
        passReqToCallback: true,
        User.findOne({
            where:{
                userName
            }
        }).then(user =>{
        
            if (!user) {
                return done(null, false, { message: "User doesn't exist" });
              }
              if (!user.validatePassword(password)) {
                return done(null, false, { message: "Password does not match" });
              }
              return done(null, user);
        })
    }))
}



module.exports.ensureAdminAuthenticated = (req, res, next)  => {
    "use strict";
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  };