import argon2 from 'argon2'
import mongoose, { Model } from "mongoose";

interface IBrain extends Document {
    username: string;
    password: string;
    share: Boolean;
    shareLink: string,
    comparePassword(candidatePassword: string): Promise<boolean>
}


const brainSchema = new mongoose.Schema<IBrain>(
    {
        username: {
            type: String,
            required: [true, 'A username must be present for a user'],
            minlength:[3, 'A minimum of 3 length is required for a user'],
            maxlength: [10,'A maximum of 10 length is required for a user'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'A password must be present for a user'],
            minlength:[8, 'A minimum of 8 length is required for a user'],
            maxlength: [20, 'A maximum of 20 length is required for a user'],
            // select: false not working suting populating for some reason
        },
        share: {
            type: Boolean,
            default: false
        },
        shareLink: {
            type: String,
            validate: {
                validator:  function(this: any, value: string) {
                    return !this.share  || this.share && value
                    
                }, 
                message: 'Sharing must be enabled'
            }
    
        }
    }
)

// Pre-save middleware
brainSchema.pre('save', async function(next) {
    
    if(!this.isModified('password')) return next();
    console.log(this)
    try {
        const hashedPassword = await argon2.hash(this.password)
        console.log(hashedPassword);
        this.password = hashedPassword
    }
    catch(err) {
        console.log("An error occured!!", err)
    }
    next()
})

brainSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await argon2.verify(this.password, candidatePassword);
};

export const BrainModel: Model<IBrain> = mongoose.model<IBrain>('BrainModel', brainSchema)