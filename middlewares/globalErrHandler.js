export const globalErrHandler = (err, req, res, next)=>{
    //build our error object
    //stack about the error
    //message
    const stack = err?.stack;
    const statusCode = err?.status ? err?.statusCode: 500;
    const message = err?.message  //this means on error we have a message(read it like that)
    res.status(statusCode).json({
        stack,
        message
    });
};

//404 handler
export const notFound=(req, res, next) =>{
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
};
