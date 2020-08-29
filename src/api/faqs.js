/* eslint-disable  */


const express = require('express');

const router = express.Router();

const monk = require('monk');
const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');

const schema = Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required(),
    video_url: Joi.string().uri(),
});

// Read All
router.get('/', async (req, res, next) => {
    try {
        const items = await faqs.find({});
        res.json(items);
    } catch (error) {
        next(error);
    }
});

// Read One
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await faqs.findOne({
            _id:id,
        });
        if(!item) return next();
        return res.json(item);
    } catch (error) {
        next(error);
    }
});

// Create One
router.post('/', async (req, res, next) => {
    try {
        console.log(req.body);
        const value = await schema.validateAsync(req.body);
        const inserted = await faqs.insert(value);
        res.json(inserted);
    } catch (error) {
        next(error);
    }
});

// Update one
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const value = await schema.validateAsync(req.body);
        const item = await faqs.findOne({
            _id:id,
        });
        if(!item){
            next();
        }
        await faqs.update({_id:id,}, {
            $set:value
        });
        res.json(value);
    } catch (error) {
        next(error);
    }
});

// Delete One
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await faqs.remove({
            _id:id,
        });
        res.json({
            message: 'Success!!!',
        });
       
    } catch (error) {
        next(error);
    }
});

module.exports = router;
