const orderEndpoint = async (ctx: any) => {
  const { req, res, handlers, config } = ctx

  const body = { ...req.body }

  return await handlers['getOrders']!({ ...ctx, body })
}

export default orderEndpoint
