import mongoose from 'mongoose';

const PostSchema= new mongoose.Schema({
    username:{type:String, required:true},
    carbrand:{type:String, required:true},
    carmodel:{type:String, required:true},
    caryear:{type:String, required: true},
    carpicture:{ type:String, required:  true},
    description:{type:String, required: false }
});

const Post = mongoose.model('post', PostSchema);
export default Post;