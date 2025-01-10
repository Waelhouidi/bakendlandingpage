const User= require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register=async (req,res)=>{
const {username,email,password}=req.body;
try {
    const hashedPassword= await bcrypt.hash(password,10);
    const newUser = new User({username,email,password:hashedPassword});
    await newUser.save();
    res.status(201).json({message:"User created successfully"});
} catch (error) {
    res.status(500).json({message:error})
}
};
exports.login=async (req,res)=>{
const {email,password}=req.body;


    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});

    }
  const token=jwt.sign({id:user._id},'123456789',{expiresIn:'1h'});
  res.status(200).json({token});
    
} catch (error) {
        res.status(500).json({message:error})
    }
};
exports.getUSerById=async (req,res)=>{
    try {
    
    } catch (error) {
        res.status(500).json({message:error})
    }
};
exports.edit=async (req,res)=>{
    try {
    
    } catch (error) {
        res.status(500).json({message:error})
    }
};