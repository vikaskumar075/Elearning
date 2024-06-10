class ErrorHandler extends Error{
    statusCode: Number;

    constructor(message: any, statusCode: Number){
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorHandler;

/*
function someFunction() {
    throw new ErrorHandler("This is a custom error", 500);
}

try {
    someFunction();
} catch (error) {
    console.log(error.stack);
}
console.log(error.stack) ke madhyam se error ka stack trace print hota hai. Stack trace mei aapko dikhayi dega ki error kahaan se originate hua hai, kis file mein, aur kis line mein.

*/