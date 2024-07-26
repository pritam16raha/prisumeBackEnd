import { ValidationError } from 'joi';
import CustomErrorHandler from '../services/customErrorHandler';

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let errorData = {
        message: 'Internal server error',
        originalError: err.message
    }

    if(err instanceof ValidationError){
        statusCode = 422;
        errorData={
            message: err.message
        }
    }

    if(err instanceof CustomErrorHandler){
        statusCode: err.status,
        errorData = {
            message: err.message
        }
    }

    return res.status(statusCode).json(errorData);
}

export default errorHandler;