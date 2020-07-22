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
experienceRouter.get("/:username/experiences", async (req, res, next) => {
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

//get the single experience username
experienceRouter.get("/:expId", async (req, res, next) => {
    try {
        const id = req.params.expId
        const experience = await experienceSchema.findById(id)
        console.log(experience)
        res.send(experience)
    } catch (error) {
        next(error)
    }
})
//post a new experience with the experience username.
experienceRouter.post("/:username/experiences", async (req, res, next) => {
    try {
        const newExperience = new experienceSchema(req.body)
        const { _id } = await newExperience.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

//edit a new experience using the experience username.
experienceRouter.put("/:expId", async (req, res, next) => {
    try {
        const id = req.params.expId
        const experience = await experienceSchema.findByIdAndUpdate(id, req.body)
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
experienceRouter.delete("/:username", async (req, res, next) => {
    try {
        const experience = await experienceSchema.findOneAndDelete({"username": req.params.username})
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
experienceRouter.post("/:expId/picture", upload.single('image'), async (req, res, next) => {
    try {
        const id = req.params.expId
        await fs.writeFile(path.join(imagePath, `${id}.jpg`), req.file.buffer)
        req.body = { image: `${id}.jpg` }
        const image = await experienceSchema.findByIdAndUpdate(id, req.body)
        if (image) {
            res.send("Image Added")
        } else {
            res.send("Not exist")
        }
    } catch (error) {
        next(error)
    }
})

experienceRouter.get('/csv', async(req, res, next)=>{
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