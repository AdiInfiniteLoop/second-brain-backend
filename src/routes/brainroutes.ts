import express from 'express'
import {signup, login, getcontent, deletecontent, postcontent, getonecontent} from '../controllers/braincontroller'
import { authorizationcontroller } from '../controllers/authorizationcontroller'
export const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.route('/content').get(authorizationcontroller, getcontent).post(authorizationcontroller, postcontent)
router.get(`/content/:id`,authorizationcontroller, getonecontent)
router.delete('/content/:id', authorizationcontroller, deletecontent)