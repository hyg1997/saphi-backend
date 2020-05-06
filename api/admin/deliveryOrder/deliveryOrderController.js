const Service = require('./deliveryOrderService');
const { validatePagination } = require('../../utils');

const getDeliveryOrder = async (req, res) => {
  const deliveryOrder = await Service.getDeliveryOrder(req.params);

  return res.status(deliveryOrder.status).send(deliveryOrder);
};

const listAdminDeliveryOrder = async (req, res) => {
  const resp = Service.generateQueryDeliveryOrder(req.body);
  if (resp.status !== 200) return res.status(resp.status).send(resp);

  const deliveryQuery = resp.data;
  const total = await Service.countDeliveryOrder(deliveryQuery);

  const pagination = validatePagination(total, req.query.page, req.query.size);
  if (pagination.status !== 200)
    return res.status(pagination.status).send(pagination);

  deliveryQuery.limit = req.query.size;
  deliveryQuery.skip = pagination.data.skip;

  const listDeliveryOrder = await Service.listAdminDeliveryOrder(deliveryQuery);

  listDeliveryOrder.data = {
    numPages: pagination.data.numPages,
    total,
    page: req.query.page,
    items: listDeliveryOrder.data,
  };
  return res.status(listDeliveryOrder.status).send(listDeliveryOrder);
};

module.exports = {
  listAdminDeliveryOrder,
  getDeliveryOrder,
};
