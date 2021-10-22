import path from 'path/posix'
import * as OpenApiValidator from 'express-openapi-validator'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'

export const apiSpec: OpenAPIV3.Document = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'myJobPlanner API',
    description: 'The myJobPlanner API',
  },
  servers: [
    { url: '/v1' }
  ],
  paths: {
    '/businesses': {
      get: {
        description: 'Returns all businesses',
        operationId: 'findBusinesses',
        parameters: [{
          name: 'type',
          in: 'query',
          description: 'maximum number of results to return',
          required: false,
          schema: {
            type: 'string',
            enum: [
              'dog',
              'cat'
            ]
          }
        }
          //         - name: tags
          //           in: query
          //           description: tags to filter by
          //           required: false
          //           style: form
          //           schema:
          //             type: array
          //             items:
          //               type: string
          //         - name: limit
          //           in: query
          //           description: maximum number of results to return
          //           required: false
          //           schema:
          //             type: integer
          //             format: int32
          //             minimum: 1
          //             maximum: 20
        ],
        responses: {
          '200': {
            description: 'business response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Business'
                  }
                }
              }
            }
          },
          default: {
            description: 'unexpected error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
  },
  components: {
    schemas: {
      Business: {
        type: 'object',
        required: [
          'id',
          'name',
          'timezone',
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'number'
          },
          name: {
            type: 'string'
          },
          timezone: {
            type: 'string'
          }
          //         # tag:
          //         #   type: string
          //         # type:
          //         #   $ref: '#/components/schemas/PetType'
        }
      },
      //     # PetType:
      //     #   type: string
      //     #   enum:
      //     #     - dog
      //     #     - cat

      Error: {
        type: 'object',
        required: [
          'code',
          'message'
        ],
        properties: {
          code: {
            type: 'integer',
            format: 'int32'
          },
          message: {
            type: 'string'
          }
        }
      }
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      }
    }
  }
}


const openApi = OpenApiValidator.middleware({
  apiSpec: apiSpec,
  validateRequests: {
    removeAdditional: true,
  },
  validateResponses: {
    removeAdditional: true,
  }
})

export default openApi