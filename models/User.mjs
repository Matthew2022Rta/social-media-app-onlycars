import mongoose from 'mongoose'
const UserSchema= new mongoose.Schema({
    username:{type:String,required:true, minLength:2},
    password:{type:String ,required:true, minLength:2}
})

const User=mongoose.model('user', UserSchema)
export default User