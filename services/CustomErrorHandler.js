class CustomErrorHandler extends Error{
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new CustomErrorHandler(409, message);
    }

    static dbError(message){
        return new CustomErrorHandler(420, message);
    }

    static notFound(message){
        return new CustomErrorHandler(425, message);
    }

    static loginError(message){
        return new CustomErrorHandler(430, message)
    }

    static updateError(message){
        return new CustomErrorHandler(435, message)
    }
}

export default CustomErrorHandler;