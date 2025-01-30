import express from 'express'
import {signup, login, getcontent, deletecontent, postcontent, getonecontent, getfromshareLink, sharelink} from '../controllers/braincontroller'
import { authorizationcontroller } from '../controllers/authorizationcontroller'
export const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.route('/content').get(authorizationcontroller, getcontent).post(authorizationcontroller, postcontent)
router.route(`/content/:id`).get(authorizationcontroller, getonecontent).delete( authorizationcontroller, deletecontent)
// router.get('/content?tag', authorizationcontroller, getContentBasedOnTag)
router.post('/brain/share', authorizationcontroller, sharelink)
router.route('/brain/:shareLink').get(authorizationcontroller, getfromshareLink)