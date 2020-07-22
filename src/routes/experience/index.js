const express = require("express")
const path = require('path')
const fs = require('fs-extra')
const multer = require('multer')
const q2m = require("query-to-mongo")
const experienceSchema = require("./experienceSchema")
const upload = multer()
const imagePath = path.join(__dirname, "../../../public/image/experiences")
const experienceRouter = express.Router()

//get all experiences
experienceRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const experience = await experienceSchema.find(query.criteria, query.options.fields)
            .skip(query.options.skip)
            .limit(query.options.limit)
            .sort(query.options.sort)

        res.send(experience)
    } catch (error) {
        next(error)
    }
})

//get the single experience id
experienceRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const experience = await experienceSchema.findById(id)
        console.log(experience)
        res.send(experience)
    } catch (error) {
        next(error)
    }
})
//post a new experience with the experience id.
experienceRouter.post("/", async (req, res, next) => {
    try {
        const newExperience = new experienceSchema(req.body)
        const { _id } = await newExperience.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

//edit a new experience using the experience id.
experienceRouter.put("/:id", async (req, res, next) => {
    try {
        const experience = await experienceSchema.findByIdAndUpdate(req.params.id, req.body)
        if (experience) {
            res.send(req.body)
        } else {
            const error = new Error(`experience with id ${req.params.id} dont exist`)
            console.log(error)
        }
    } catch (error) {
        next(error)
    }
})
//Delete a new experience using the student id.
experienceRouter.delete("/:id", async (req, res, next) => {
    try {
        const experience = await experienceSchema.findByIdAndDelete(req.params.id)
        if (experience) {
            res.send(`experience with id: ${req.params.id} was deleted successfully`)
        } else {
            console.log(`experience with id: ${req.params.id} not found in Database`)
        }
    } catch (error) {
        next(error)
    }
})
//upload a new image using the.console
experienceRouter.post("/:id/image", upload.single('image'), async (req, res, next) => {
    try {
        await fs.writeFile(path.join(imagePath, `${req.params.id}.jpg`), req.file.buffer)
        req.body = { image: `${req.params.id}.jpg` }
        const image = await experienceSchema.findByIdAndUpdate(req.params.id, req.body)
        if (image) {
            res.send("Image Added")
        } else {
            res.send("Not exist")
        }
    } catch (error) {
        next(error)
    }
})

experienceRouter.get('/:username/cv', async(req, res, next)=>{
    try {
     
     const profile = await ProfileModel.findOne( {'username':req.params.username})     
        
          const  fields = ["_id","name","surname","email","bio","title",
           "area","image","username","createdAt","updatedAt"]
     
         const data = {fields}
const csv = json2csv.parse(profile,data)
res.setHeader("Content-Disposition", "attachment; filename=profile.csv")
    res.send(csv)    
    } catch (error) {
        next(error)
    }
})




module.exports = experienceRouter