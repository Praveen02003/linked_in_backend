import mongoose from 'mongoose';
const now = new Date();

const indianTime = now.toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour12: true,
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
const postSchema = new mongoose.Schema({
  author: 
  { 
    type: String, 
    required:true 
},
  content:{
    type:String,
    required:true
  },
  createdAt: 
  { 
    type: String, 
    default: indianTime
}
});

export const Post = mongoose.model('Post', postSchema);