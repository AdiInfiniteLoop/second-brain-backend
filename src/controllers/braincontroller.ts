import { Request, Response, NextFunction } from "express"
import { catchAsync } from "../utils/catchAsync"
import { BrainModel } from "../models/brainmodel"
import { ErrorClass } from "../utils/errorClass"
import jwt from 'jsonwebtoken'

//req: Request, res: Response, next: NextFunction


//validation error catch?
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
	
	const user = await BrainModel.findOne({username: req.body.username})

	if(user) {
		return next(new ErrorClass("Sorry! The user already exists with this username", 403));
	}
	
		await BrainModel.create(req.body)
		 res.status(200).json({
			status: 'Success',
			message: 'User successfully created'
		})
	
	next()
})
// {username, password}
//{token}
export const login = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
   const {username, password, passwordConfirm} =  req.body;
   if(password !== passwordConfirm) {
	return new ErrorClass('The passwords do not match', 403)
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
})


