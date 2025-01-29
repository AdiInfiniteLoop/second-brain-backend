import mongoose, { Schema, model } from "mongoose";

const contentSchema = new Schema({
    title: {
        type: String,       
        required: [true, 'A title is a must for a content']
    },
    link: {
        type: String,       
        required: [true, 'A link is a must for a content']
    },
    type: {
        type: [String],       
        required: [true, 'A type(s) is a must for a content']
    },
    tags:{
        type: [{
            type: mongoose.Types.ObjectId, ref: 'Tags'
        }],       
        required: [true, 'A tag(s) is a must for a content']
    },
    userId: {
        type: mongoose.Types.ObjectId, ref: 'User',
        required: true
    }
})


export const ContentModel = model('ContentModel', contentSchema)