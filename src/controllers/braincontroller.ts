import { Request, Response, NextFunction } from "express"
import { catchAsync } from "../utils/catchAsync"
import { BrainModel } from "../models/brainmodel"
import { ContentModel } from "../models/contentmodel"
import { ErrorClass } from "../utils/errorClass"
import jwt from 'jsonwebtoken'


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
	const user = await BrainModel.findOne({username: req.body.username})
	try {
			
	if(user) {
		return next(new ErrorClass("Sorry! The user already exists with this username", 403));
	}
		await BrainModel.create(req.body)
		 res.status(200).json({
			status: 'Success',
			message: 'User successfully created'
		})
	}
	catch(er: any) {
		// console.log(er)
		return next(new ErrorClass(er.message, 403))
	}
	next()
})

export const login = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
   const {username, password, passwordConfirm} =  req.body;
   if(password !== passwordConfirm) {
	return next(new ErrorClass('The passwords do not match', 403))
   }

   const user  = await BrainModel.findOne({username: username})
   //⚠️ Warning: Using as string suppresses TypeScript's safety checks. Ensure SECRET_KEY is always set.


   if(user && process.env.JWT_SECRET) {
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '2 days',
	  });
	res.status(200).json({status: 'Success', message: 'TOKEN Sent', token})
   }

   else {
	 res.status(401).json({status: 'Failed', message: 'No such user found!'})

   }
   next()
})


export const getcontent = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<any> => {

})
export const postcontent = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<any> => {
	if(!req.body.type || !req.body.link || !req.body.title || !req.body.tags) {
		return next(new ErrorClass('Fields are Empty', 403))
	}
	await ContentModel.create(req.body)

	res.status(200).json({status: 'Success', message: 'Successfully posted the content'})
})