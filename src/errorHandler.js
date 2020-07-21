const notFoundHandler = (err, req, res, next) => {
    if(err.httpStatusCode === 404){
        res.status(404).send(err.message || "Resource not found")
    }
    next(err)
}

const badRequestHandler = (err, req, res, next) => {
    if(err.httpStatusCode === 400){
        res.status(400).send(err.message)
    }
    next(err)
}

const newlyDefinedErrorHandler = (err, req, res, next) => {
    if(err.httpStatusCode === 456){
        res.status(456).send(err.message)
    }
    next(err)
}

const otherGenericErrorHandler = (err, req, res, next) => {
    if(!res.HeadersSent){
        res.status(err.httpStatusCode || 500).send(err.message || "internal server error")
    }
}

module.exports = {
    notFoundHandler,
    badRequestHandler,
    newlyDefinedErrorHandler,
    otherGenericErrorHandler
}