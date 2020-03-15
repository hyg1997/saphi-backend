const Service = require('./deliveryOrderService');
const PaymentService = require('../../payment/culqiPayment/culqiPaymentService');

const createDeliveryOrder = async (req, res) => {
  // * Step 0. Validar que el input genera una orden correcta
  const validate = await Service.validateDeliveryOrder(req.body);

  if (validate.status !== 200)
    return res.status(validate.status).send(validate);
  // * Step 1. Procesar el pago
  const culqiPayment = await PaymentService.makePayment(req.body, req.user);

  if (culqiPayment.status !== 201)
    return res.status(culqiPayment.status).send(culqiPayment);

  // * Step 2. Luego de haber recibido la confirmacion de pago se crea la orden en la db
  const deliveryOrder = await Service.createDeliveryOrder(
    {
      ...req.body,
      culqiPayment: culqiPayment.data,
    },
    req.user,
  );

  return res.status(deliveryOrder.status).send(deliveryOrder);
};

const getUserDeliveryOrder = async (req, res) => {
  const deliveryOrder = await Service.getUserDeliveryOrder(req.user);

  return res.status(deliveryOrder.status).send(deliveryOrder);
};

module.exports = {
  createDeliveryOrder,
  getUserDeliveryOrder,
};
