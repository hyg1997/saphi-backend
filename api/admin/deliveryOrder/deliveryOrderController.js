const Service = require('./deliveryOrderService');
const { validatePagination } = require('../../utils');

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
  listAdminDeliveryOrder,
  getDeliveryOrder,
};
