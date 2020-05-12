const express = require('express');

const router = express.Router();
const secureRouter = express.Router();

const { authenticateMiddleware } = require('../middleware/auth');

router.use('/quizzes', require('./quiz/quiz.router'));
router.use('/quizanswers', require('./quizAnswer/quizAnswer.router'));
router.use('/chapters', require('./chapter/chapter.router'));
router.use('/', require('./profile/profile.router'));

secureRouter.use('/', authenticateMiddleware('jwt'), router);

module.exports = secureRouter;
