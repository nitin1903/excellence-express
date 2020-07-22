async function validateToken(req, res, next) {
    const token = req.get('authorization').split(' ')[1]
    console.log(`token ${token}`)
    if(token == null)
        return res.sendStatus(403)
    res.locals.accessToken = token
    try{
        let result = await AccessToken.findOne({access_token: token})
  
        if(result == null){
            return res.sendStatus(403)
        }
        const d = new Date()
        if(d > result.expiry) {
          return res.status(403).send("token expired")
        }
        res.locals.result = result
        next()
    } catch(err) {
        console.log(err)
        return res.sendStatus(500)
    }
  }

  module.exports = validateToken