const express = require('express')
const path = require('path')
const fs = require('fs-extra')
const multer = require('multer')
const q2m = require('query-to-mongo')
const {join} = require("path")
const ProfileModel = require("./schema")
const json2csv = require("json2csv")
const profileRouter = express.Router()
const upload = multer()
const port = process.env.PORT
const experienceModel = require("./experienceSchema")
const PdfPrinter = require('pdfmake')
const imagePath = path.join(__dirname, "../../../public/image/profile")

profileRouter.get('/', async(req, res, next)=>{
    try {
        const query = q2m(req.query)
        console.log(query)
        const users = await ProfileModel.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)
        res.send({totalUsers: users.length, data: users})
    } catch (error) {
        next(error)
    }
})

profileRouter.get('/:username', async(req, res, next)=>{
    try {
        const user = await ProfileModel.findOne({'username': req.params.username})
        if(user){
            res.status(200).send(user)
        }
        else res.status(404).send('not found!')
    } catch (error) {
        next(error)
    }
})

profileRouter.post('/', async(req, res, next)=>{
    try {
        const newUser = new ProfileModel(req.body)
        const {_id} = await newUser.save()
        res.status(200).send(_id)
    } catch (error) {
        next(error)
    }
})

//get all experiences
profileRouter.get("/:username/experiences", async (req, res, next) => {
  try {
      const query = q2m(req.query)
      const experience = await experienceModel.find(query.criteria, query.options.fields)
          .skip(query.options.skip)
          .limit(query.options.limit)
          .sort(query.options.sort)

      res.send(experience)
  } catch (error) {
      next(error)
  }
})

//get the single experience username
profileRouter.get("/:username/experiences/:expId", async (req, res, next) => {
  try {
      const id = req.params.expId
      const experience = await experienceModel.findById(id)
      console.log(experience)
      res.send(experience)
  } catch (error) {
      next(error)
  }
})

//profile experiences
profileRouter.post("/:username/experiences", async (req, res, next) => {
  try {
      const newExperience = new experienceModel(req.body)
      const { _id } = await newExperience.save()

      res.status(201).send(_id)
  } catch (error) {
      next(error)
  }
})

//edit a new experience using the experience username.
profileRouter.put("/:username/experiences/:expId", async (req, res, next) => {
    try {
        const id = req.params.expId
        const experience = await experienceModel.findByIdAndUpdate(id, req.body)
        if (experience) {
            res.send(req.body)
        } else {
            const error = new Error(`experience with username: ${req.params.username} dont exist`)
            console.log(error)
        }
    } catch (error) {
        next(error)
    }
})

//Delete a new experience using the student username.
profileRouter.delete("/:username/experiences/:expId", async (req, res, next) => {
    try {
        const id = req.params.expId
        const experience = await experienceModel.findByIdAndDelete(id)
        if (experience) {
            res.send(`experience with username: ${req.params.username} was deleted successfully`)
        } else {
            console.log(`experience with username: ${req.params.username} not found in Database`)
        }
    } catch (error) {
        next(error)
    }
})


//upload a new image using the.console
profileRouter.post("/:username/experiences/:expId/picture", upload.single('image'), async (req, res, next) => {
    try {
        const id = req.params.expId
        await fs.writeFile(path.join(imagePath, `${id}.jpg`), req.file.buffer)
        req.body = { image: `${id}.jpg` }
        const image = await experienceModel.findByIdAndUpdate(id, req.body)
        if (image) {
            res.send("Image Added")
        } else {
            res.send("Not exist")
        }
    } catch (error) {
        next(error)
    }
})

profileRouter.get('/:username/experiences/csv', async(req, res, next)=>{
    try {
     
     const profile = await ProfileModel.findOne( {'username':req.params.username})     
        
          const  fields = ["_id","role","company","startDate","endDate","description",
           "area","username"]
     
         const data = {fields}
const csv = json2csv.parse(profile,data)
res.setHeader("Content-Disposition", "attachment; filename=profile.csv")
    res.send(csv)    
    } catch (error) {
        next(error)
    }
})


profileRouter.put('/:username', async(req, res, next)=>{
    try {
        const user = await ProfileModel.findOneAndUpdate({'username': req.params.username}, req.body)
        if (user) {
          res.send("Record updated!")
        } else {
          const error = new Error(`User with username ${req.params.username} not found`)
          error.httpStatusCode = 404
          next(error)
        }
      } catch (error) {
        next(error)
      }
})


profileRouter.delete('/:username', async(req, res, next)=>{
  try {
      const user = await ProfileModel.findOneAndDelete({'username': req.params.username})
      if (user) {
        res.send(`Username: ${req.params.username} was deleted successfully`)
      } else {
        const error = new Error(`User with username ${req.params.username} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
})

profileRouter.post('/:username/picture', upload.single('userImage'), async(req, res, next)=>{
    
  try {
    await fs.writeFile(path.join(imagePath, `${req.params.username}.jpg`), req.file.buffer)
    
    req.body = {
      image: `${imagePath}/${req.params.username}.jpg`
    }
    const user = await ProfileModel.findOneAndUpdate({'username': req.params.username}, req.body)
    if (user) {
      res.send("Record updated!")
    } else {
      const error = new Error(`User with username ${req.params.username} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.get('/:username/cv', async(req, res, next)=>{
    
  try {
      const user = await ProfileModel.findOne({'username': req.params.username})
      if(user){
          var fonts = {
              Roboto: {
                  normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
                  bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
                  italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
                  bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
              }
          };
          var printer = new PdfPrinter(fonts);
          var docDefinition = {
              pageMargins: [150, 50, 150, 50],
              content: [
                  { text: `${user.username}`, fontSize: 25, background: 'yellow', italics: true },
                  {
                      image: `${path.join(imagePath, `${req.params.username}.jpg`)}`,
                      width: 150
                  },
                  "                                                                         ",
                  `             Name: ${user.name}`,
                  `             Surname: ${user.surname}`,
                  `             Email: ${user.email}`,
                  `             Bio: ${user.bio} $`,
                  `             Title: ${user.title}`,
                  `             Area: ${user.area}`,
              ]
          }

          var pdfDoc = printer.createPdfKitDocument(docDefinition);
          res.setHeader("Content-Disposition", `attachment; filename=${user.name}.pdf`)
          res.contentType("application/pdf")
          pdfDoc.pipe(res)
          pdfDoc.end()
      }
      else res.status(404).send('not found!')
  
  } catch (error) {
    next(error)
  }
})

module.exports = profileRouter