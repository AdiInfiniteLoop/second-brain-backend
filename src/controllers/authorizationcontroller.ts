//will get token, decrypt it, check the user then proceed
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { BrainModel } from '../models/brainmodel';
import { catchAsync } from '../utils/catchAsync';
import { ErrorClass } from '../utils/errorClass';




export const authorizationcontroller = catchAsync (async(req: Request, res:Response, next:NextFunction) => {
    const tokenVal = req.headers.authorization?.toString().split(' ')[1];
    if (!tokenVal || !process.env.JWT_SECRET) {
        return next(new ErrorClass('Token Invalid', 403));
    }

    try {
            const decodedVal = jwt.verify(tokenVal, process.env.JWT_SECRET)
    
            if (typeof decodedVal !== 'object' || !('_id' in decodedVal)) {
                return next(new ErrorClass('Invalid token payload', 403));
            }
          ``
    //TS2339: Property 'username' does not exist on type 'string | JwtPayload' because decodedVal is inferred as string | JwtPayload, meaning TypeScript isn't sure if it's a string or an object.
            
            const user = await BrainModel.findOne({_id: decodedVal._id}) //as username is unique
    
            if(!user) {
                next(new ErrorClass('Not authorized', 401))
            }
            req.user = user
            next()
    }
    catch(err: any) {
        next(new ErrorClass(err.message, 401))
    }
}
)
