import { Schema, model } from "mongoose";

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
        type: [String],       
        required: [true, 'A tag(s) is a must for a content']
    }
})


export const ContentModel = model('ContentModel', contentSchema)