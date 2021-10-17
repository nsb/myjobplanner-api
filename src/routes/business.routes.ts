import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import BusinessController from '../controllers/business.controllers'

function BusinessRouter(businessController: BusinessController) {
  const doc = {
    GET: [checkJwt, jwtAuthz(['read:business']), businessController.getAllBusinesses.bind(businessController)]
  }

  doc.GET.apiDoc = {
    summary: "Fetch todos.",
    operationId: "getTodos",
    responses: {
      200: {
        description: "List of todos.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Todo",
          },
        },
      },
    },
  };

  return doc
}

export default BusinessRouter