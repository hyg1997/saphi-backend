const path = require('path');

const nutritionRouter = require('../api/nutrition/nutritionRouter');
const paymentRouter = require('../api/payment/PaymentRouter');
const mentalHealthRouter = require('../api/mentalHealth/mentalHealth.router');
const adminRouter = require('../api/admin/adminRouter');
const authRouter = require('../api/auth/authRouter');
const patientRouter = require('../api/patient/patient.router');

module.exports = app => {
  app.get('/culqi', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/culqui_form.html'));
  });
  app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../templates/redoc.html'));
  });

  app.use('/', authRouter);
  app.use('/payment', paymentRouter);
  app.use('/mentalHealth', mentalHealthRouter);
  app.use('/', nutritionRouter);
  app.use('/', adminRouter);
  app.use('/', patientRouter);
};
