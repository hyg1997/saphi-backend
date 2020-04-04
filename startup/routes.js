const path = require('path');

const nutritionRouter = require('../api/nutrition/nutritionRouter');
const paymentRouter = require('../api/payment/PaymentRouter');
const companyRouter = require('../api/auth/company/companyRouter');
const authRouter = require('../api/auth/authRouter');

module.exports = app => {
  app.get('/culqi', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/culqui_form.html'));
  });
  app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/redoc.html'));
  });

  app.use('/auth', authRouter);
  app.use('/payment', paymentRouter);
  app.use('/company', companyRouter);
  app.use('/', nutritionRouter);
};
