const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.use(new localStrategy({
    usernameField: 'user_name',
    passwordField: 'password'
}, async (user_name, password, done) => {
    try{
        const user = await User.getUser({user_name, password})
        if(!user){
            return done(null, false, {message: 'invalid username or password'})
        }
        return done(null, user, {message: 'logged in successfully'})
    } catch(err) {
        done(err)
    }
}))

passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.getUserById(id)
        if(user){
            return done(null, user)
        }
        return done(new Error('user not found'))
    } catch(err) {
        return done(err)
    }
});