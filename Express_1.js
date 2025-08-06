import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Signupuser } from './Express_2.js';
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';
import { Post } from './Express_3.js';
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 5000;
mongoose.connect('mongodb://localhost:27017/linkedin_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('DB connection error:', err));

const secretKey = '19112003';

const verifytoken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const tokens = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(tokens, secretKey);
    req.userid = decoded.userid; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



app.get('/', (req, res) => {
  res.send('Hello from Node.js with import!');
});

app.post('/register',async(req, res) => {
  const
  {name,
  email,
  password,
  confirmpassword,
  bio}=req.body
  if (password != confirmpassword)
  {
    res.json({message:"Password Mismatched"})
  }
  else
  {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try
    {
      const signup_data=await Signupuser.insertOne({
        name:name,
        email:email,
        password:hashedPassword,
        bio:bio
      })
      //console.log(signup_data);
      
      res.json({message:"Signup Successfully"})
    } 
    catch (error)
    {
      res.status(500).json({ message: "Email already exists" });
    }
  }
  
  
});

app.post('/login',async(req,res)=>{
  const{loginemail,loginpassword}=req.body
  
  const getdata=await Signupuser.findOne({email:loginemail})
  if (getdata)
  {
    //console.log(getdata);
    const isMatch = await bcrypt.compare(loginpassword, getdata.password);
    if (isMatch)
    {
      //console.log(isMatch);
      const token = jwt.sign({userid:getdata._id}, secretKey, { expiresIn: '1h' });
      //console.log(token);
      
      res.json({generated_token:token,message:"Login Successfull"})
    }
    else
    {
      res.json({message:"Invalid Password"})
    }
       
  }
  else
  {
    res.json({message:"Invalid Credentials Please Signup"})
  }
  
})

app.get('/profiles',verifytoken,async(req,res)=>{
  const id=req.userid
  //console.log(id);
  const findlogindata=await Signupuser.find({_id:id})
  //console.log(findlogindata);
  res.json({datas:findlogindata})
  
  
})

app.post('/postdata',async(req,res)=>{
  const{authorname,postcontent}=req.body
  try {
    const postinputdata=await Post.insertOne({author:authorname,content:postcontent})
    console.log(postinputdata);
    
    res.json({message:"Posted Successfully"})
  } catch (error) {
    res.json({message:"Posted Failed"})
  }
})

app.get('/getpost',async(req,res)=>{
  try {
    const getdata=await Post.find()
    res.json({datas:getdata})
  } catch (error) {
    res.json({message:"No Post Found"})
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
