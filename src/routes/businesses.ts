import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import BusinessController from '../controllers/business.controllers'
import { Operation } from 'express-openapi'

function BusinessRouter(businessController: BusinessController) {

  const GET: Operation = [checkJwt, jwtAuthz(['read:business']), businessController.getBusinesses.bind(businessController)]

  GET.apiDoc = {
    summary: "Fetch businesses.",
    operationId: "getBusinesses",
    responses: {
      200: {
        description: "List of business.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Business",
          },
        },
      },
    },
  };

  return {
    GET: GET
  }
}

export default BusinessRouter