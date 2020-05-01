const Service = require('./deliveryOrderService');
const PaymentService = require('../../payment/culqiPayment/culqiPaymentService');

const { validatePagination } = require('../../utils');

const createDeliveryOrder = async (req, res) => {
  // * Step 0. Validar que el input genera una orden correcta
  const validate = await Service.validateDeliveryOrder(req.body);

  if (validate.status !== 200)
    return res.status(validate.status).send(validate);
  // * Step 1. Procesar el pago
  const selectedPlan = req.body.deliveryPlan.selectedOption;
  const culqiPayment = await PaymentService.makePayment(
    req.body,
    req.user,
    selectedPlan,
    'Menú Delivery',
  );

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

const getDeliveryOrder = async (req, res) => {
  const deliveryOrder = await Service.getDeliveryOrder(req.params);

  return res.status(deliveryOrder.status).send(deliveryOrder);
};

const listAdminDeliveryOrder = async (req, res) => {
  const resp = Service.generateQueryDeliveryOrder(req.body);
  if (resp.status !== 200) {
    return res.status(resp.status).send(resp);
  }

  const listDeliveryOrder = await Service.listAdminDeliveryOrder(resp.data);
  const total = listDeliveryOrder.data.length;

  const pagination = validatePagination(total, req.query.page, req.query.size);

  if (pagination.status !== 200) return pagination;

  const { page } = req.query;
  const items = listDeliveryOrder.data.slice(
    pagination.data.skip,
    pagination.data.skip + req.query.size,
  );

  listDeliveryOrder.data = {
    numPages: pagination.data.numPages,
    total,
    page,
    items,
  };
  return res.status(listDeliveryOrder.status).send(listDeliveryOrder);
};

module.exports = {
  createDeliveryOrder,
  getUserDeliveryOrder,
  listAdminDeliveryOrder,
  getDeliveryOrder,
};
