export class ErrorClass extends Error {
    statusCode: number;
    status: string
    constructor(message: string , statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor)
   
    }
    
}