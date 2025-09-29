const jwt = require('jsonwebtoken');

exports.auth = (req,res,next)=>{
  const token = req.headers['authorization'];
  if(!token) return res.status(401).json({msg:'No token'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    return res.status(401).json({msg:'Invalid token'});
  }
}

exports.isAdmin = (req,res,next)=>{
  if(req.user.role!=='admin') return res.status(403).json({msg:'Admins only'});
  next();
}