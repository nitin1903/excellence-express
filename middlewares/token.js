async function validateToken(req, res, next) {
    const token = req.get('authorization').split(' ')[1]
    if(token == null)
        return res.status(401).json({message: "no access token provided"})
    res.locals.accessToken = token
    try{
        let result = await AccessToken.findOne({access_token: token})
  
        if(result == null){
            return res.sendStatus(401).json({message: "access token not found"})
        }
        const d = new Date()
        if(d > result.expiry) {
          return res.status(401).json({message: "token expired"})
        }
        res.locals.result = result
        next()
    } catch(err) {
        return res.status(500).json({error: "internal server error"})
    }
  }

  module.exports = validateToken