import express from 'express'
import {signup, login, getcontent,postcontent} from '../controllers/braincontroller'

export const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/content', getcontent)
router.post('/content', postcontent)
