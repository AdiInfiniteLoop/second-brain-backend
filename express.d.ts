import { User } from './src/models/brainmodel'; 

//To customize the Request Object from express and add User to it
declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}
