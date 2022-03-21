const getOrders = async ({ req, res, config }: any) => {
  console.log('getOrders')

  res.status(200).json({
    data: {
      name: 'getOrders',
    },
  })
}

export default getOrders
