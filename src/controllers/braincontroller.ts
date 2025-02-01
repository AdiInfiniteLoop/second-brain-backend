import { Request, Response, NextFunction } from "express"
import { catchAsync } from "../utils/catchAsync"
import { BrainModel } from "../models/brainmodel"
import { ContentModel } from "../models/contentmodel"
import { ErrorClass } from "../utils/errorClass"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from "zod";

const userschema = z.object({
	username: z.string().min(3, { message: "Must be 3 or more characters long" }),
	password: z.string().min(8, { message: "Must be 8 or more characters long" })
})

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {		
	const validatedData = userschema.parse(req.body);
	const user = await BrainModel.findOne({username: req.body.username})

	if(user) {
		return next(new ErrorClass("Sorry! The user already exists with this username", 403));
	}
		await BrainModel.create(validatedData)
		 res.status(200).json({
			status: 'Success',
			message: 'User successfully created'
		})
	}
	catch(error: unknown) {
		// console.log(er)
			if (error instanceof z.ZodError) {
				return res.status(400).json({ status: "Fail", errors: error.errors });
			}
			if (error instanceof Error) {
				return next(new ErrorClass(error.message, 500));
			}
			return next(new ErrorClass("An unknown error occurred", 500));
	}
})

export const login = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
   const {username, password, passwordConfirm} =  req.body;
   
   if(password !== passwordConfirm) {
	return next(new ErrorClass('The passwords do not match', 403))
   }

   const user  = await BrainModel.findOne({username: username}).lean()
   //⚠️ Warning: Using as string suppresses TypeScript's safety checks. Ensure SECRET_KEY is always set.


   if(user && process.env.JWT_SECRET) {
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
		expiresIn: '1 day',
	  });
	res.status(200).json({status: 'Success', message: 'TOKEN Sent', token})
   }

   else {
	 res.status(401).json({status: 'Failed', message: 'No such user found!'})
   }
   next()
})


export const getcontent = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	const userId = req.user._id
	if(!userId) {
		return next(new ErrorClass('Not AUTHORIZED', 401))
	}

	// console.log( userId)

	const content = await ContentModel.find({userId: userId}).populate({
		path: 'userId',
		select: '-password'
	})
	if(!content) {
		return next(new ErrorClass('No Content Found', 404))
	}
	res.status(200).json({
		status: 'Success',
		message: 'Successfully fetched contents',
		data: content
	})
})

export const getonecontent = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params; 

    if (!id) {
        return next(new ErrorClass('No ID is passed', 400)); 
    }
    try {
        const content = await ContentModel.findOne({ _id: id }).populate({
			path: 'userId',
			select: '-password'
		})

        if (!content) {
            return next(new ErrorClass('Content not found', 404));  
        }

        res.status(200).json({
            status: 'Success',
            message: 'Successfully fetched content',
            content: content,
        });
    } catch (error:  unknown) {
		if (error instanceof Error) {
			return next(new ErrorClass(error.message, 500));
		}
		return next(new ErrorClass("An unknown error occurred", 500));
    }
});

export const postcontent = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	// if(!req.body.type || !req.body.link || !req.body.title || !req.body.tags) {
	// 	return next(new ErrorClass('Fields are Empty', 403))
	// }
	if(!req.body.link || !req.body.title) {
		return next(new ErrorClass('Fields are Empty', 403))
	}
	console.log(req)
	const {title, link, type, tags} = req.body;
	await ContentModel.create({
		title,
		link,
		type,
		userId: req.user._id,
		tags: tags
	})


	res.status(200).json({status: 'Success', message: 'Successfully posted the content'})
})

export const deletecontent = catchAsync(async(req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
	const id = req.params.id;

	if (!id) {
        return next(new ErrorClass('No ID is passed', 400)); 
    }
	const userId = req.user.userId;
    try {

        const content = await ContentModel.deleteOne({ _id: id , userId: userId});
		console.log(content)
        if (content.deletedCount === 0) {
            return next(new ErrorClass('Content not found', 404));  
        }

        res.status(200).json({
            status: 'Success',
            message: 'Deleted the content',
            content: content,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
			return next(new ErrorClass(error.message, 500));
		}
		return next(new ErrorClass("An unknown error occurred", 500));
    }
})

export const getfromshareLink = catchAsync(async(req:Request, res: Response, next: NextFunction): Promise<any>  => {
	const shareLink = req.params.shareLink;
	if(!shareLink) {
		return next(new ErrorClass('No share Link Found', 403))
	} 
	const userID = await BrainModel.findOne({shareLink})
	if(!userID) {
		return next(new ErrorClass('No User found', 404))
	}

	const contents = await ContentModel.find({userId: userID._id})
	if(!contents) {
		return next(new ErrorClass('No Such User Present', 404))
	}
	res.status(200).json({
		status: 'Success',
		message: 'Got all the data', 
		data: contents
	})
})
export const sharelink = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { share } = req.body;
    if (!share) {
        return next(new ErrorClass('Share value not provided', 403));
    }

    const userId = req.user._id;
    if (!userId) {
        return next(new ErrorClass('Not authenticated', 403));
    }

    const user = await BrainModel.findById(userId);

    if (!user) {
        return next(new ErrorClass('User not found', 404));
    }
	//return already generated link
    if (user.share && user.shareLink) {
        return res.status(200).json({
            status: 'Success',
            message: 'Shareable link already exists',
            shareableLink: user.shareLink
        });
    }

    const generatedLink = crypto.randomBytes(16).toString('hex');

    const updateResult = await BrainModel.updateOne(
        { _id: userId },
        { $set: { share: true, shareLink: generatedLink } }
    );

    if (updateResult.modifiedCount === 0) {
        return next(new ErrorClass('Failed to update share link', 500));
    }

    res.status(200).json({
        status: 'Success',
        message: 'Successfully generated the shareable link',
        shareableLink: generatedLink
    });
});

