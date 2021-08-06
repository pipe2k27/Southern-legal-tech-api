import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    sub: {
        type: String,
        required: true
    },
    identifier: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    plan: {
        type: String,
        required: false,
        default: null,
    },
    company: {
        type: String,
        required: false
    }, 
    availableContracts : {
        type: [{
        title : String,
        startAmount : Number,
        currentAmount : Number,
         }],
        required: false
    },
   anyContracts: {
       type: {
           startAmount: Number,
           currentAmount: Number
       },
        required: false,
        default: {
            startAmount: 0,
            currentAmount: 0
        }
   }
},{timestamps: true})

export const User = mongoose.model('andesUser', userSchema);