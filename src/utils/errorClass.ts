export class ErrorClass extends Error {
    statusCode: number;
    status: string;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = 'error';
      this.name = this.constructor.name;
    }
  }
  