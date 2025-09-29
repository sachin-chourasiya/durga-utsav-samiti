const Member = require('../models/Member');

exports.getMembers = async (req,res)=>{
  const members = await Member.find().select('-password');
  res.json(members);
}

exports.updatePayment = async (req,res)=>{
  try{
    const { memberId, month, status, amount } = req.body;
    if(!memberId || !month || !status) return res.status(400).json({msg:'Missing fields'});
    const member = await Member.findById(memberId);
    if(!member) return res.status(404).json({msg:'Member not found'});
    const existing = member.payments.find(p=>p.month===month);
    if(existing){
      existing.status=status;
      if(amount) existing.amount=amount;
    } else {
      member.payments.push({month, status, amount: amount || 100});
    }
    await member.save();
    const out = member.toObject();
    delete out.password;
    res.json(out);
  }catch(err){
    res.status(500).json({msg:'Server error', error: err.message});
  }
}

exports.getMonthlyTotals = async (req,res)=>{
  try{
    const members = await Member.find();
    const monthlyTotals = {};
    members.forEach(m=>{
      m.payments.forEach(p=>{
        if(!monthlyTotals[p.month]) monthlyTotals[p.month]=0;
        if(p.status==='paid') monthlyTotals[p.month]+=p.amount || 0;
      })
    });
    res.json(monthlyTotals);
  }catch(err){
    res.status(500).json({msg:'Server error', error: err.message});
  }
}

exports.setDefaultAmount = async (req,res)=>{
  try{
    const { amount } = req.body;
    if(!amount) return res.status(400).json({msg:'Amount required'});
    const members = await Member.find();
    for(let m of members){
      m.payments = m.payments.map(p=>({ ...p, amount }));
      await m.save();
    }
    res.json({msg:`Default amount set to ${amount} for all members`});
  }catch(err){
    res.status(500).json({msg:'Server error', error: err.message});
  }
}