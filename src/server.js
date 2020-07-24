const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const staticFolderPath = join(__dirname, "../public")
const profileRouter = require('./routes/profiles')
const port = process.env.PORT
const experienceRouter = require("./routes/experience")
const posts = require("./routes/posts")
const server = express()
const feurl = process.env.FEURL


const {
    notFoundHandler,
    badRequestHandler,
    otherGenericErrorHandler,
    newlyDefinedErrorHandler,
  } = require("./errorHandler")


server.use(express.static(staticFolderPath))
server.use(express.json())



server.use("/posts", posts)
server.use("/profiles", profileRouter)
// server.use("/experiences", experienceRouter)

server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(newlyDefinedErrorHandler)
server.use(otherGenericErrorHandler)


const whitelist =  process.env.NODE_ENV === "production"
 
   ?
 [process.env.FEURL]
  :
  [process.env.FE_URL]
 
  


const corsOptions = {
  origin: function (origin, callback) 
{
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } 
else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}
server.use(cors(corsOptions))
console.log(listEndpoints(server))
mongoose.connect("mongodb+srv://eriseld:troy1894@cluster0.j7g0j.mongodb.net/linkedindb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(
        server.listen( port || 3009, () => {
            console.log("Running on port", port || 3009)
        })
    )
    .catch((err) => console.log(err))

