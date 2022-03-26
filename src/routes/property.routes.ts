import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import openApi from '../openapi'
import PropertyController from '../controllers/property.controllers'

function PropertyRouter(propertyController: PropertyController) {
    const router = Router()

    return router.post(
        '/',
        checkJwt,
        // jwtAuthz(['create:property', 'read:property']),
        openApi,
        propertyController.create.bind(propertyController)
    ).get(
        '/',
        checkJwt,
        // jwtAuthz(['read:property']),
        openApi,
        propertyController.getProperties.bind(propertyController)
    )
}
PropertyRouter.inject = ['propertyController'] as const

export default PropertyRouter