import { Request, Response, NextFunction } from "express"
import { catchAsync } from "../utils/catchAsync"
import { BrainModel } from "../models/brainmodel"
import { ErrorClass } from "../utils/errorClass"


//req: Request, res: Response, next: NextFunction

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
export const login = (req: Request, res: Response, next: NextFunction) => {
   
}


