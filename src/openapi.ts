import * as OpenApiValidator from 'express-openapi-validator'
import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'

export const apiSpec: OpenAPIV3.Document = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'myJobPlanner API',
    description: 'The myJobPlanner API'
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
          $ref: '#/components/parameters/offsetParam'
        }, {
          $ref: '#/components/parameters/limitParam'
        }, {
          $ref: '#/components/parameters/orderDirectionParam'
        }, {
          name: 'orderBy',
          in: 'query',
          description: 'Order by field',
          required: false,
          schema: {
            type: 'string',
            enum: [
              'id',
              'created',
              'name'
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
        ],
        responses: {
          200: {
            description: 'business response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Business'
                      }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        totalCount: {
                          readOnly: true,
                          type: 'number'
                        }
                      }
                    }
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
      },
      post: {
        description: 'Create business',
        operationId: 'createBusiness',
        requestBody: {
          description: 'Create business',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Business'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'business response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Business'
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
    '/businesses/{Id}': {
      get: {
        description: 'Returns a single business',
        operationId: 'getBusiness',
        parameters: [{
          $ref: '#/components/parameters/idParam'
        }],
        responses: {
          200: {
            description: 'get business response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Business'
                }
              }
            }
          },
          404: {
            description: 'get business not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
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
    '/businesses/{businessId}/clients': {
      get: {
        description: 'Returns all clients',
        operationId: 'findClients',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/offsetParam'
          }, {
            $ref: '#/components/parameters/limitParam'
          }, {
            $ref: '#/components/parameters/orderDirectionParam'
          }
        ],
        responses: {
          200: {
            description: 'client response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Client'
                      }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        totalCount: {
                          readOnly: true,
                          type: 'number'
                        }
                      }
                    }
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
      },
      post: {
        description: 'Create client',
        operationId: 'createClient',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          }
        ],
        requestBody: {
          description: 'Create client',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Client'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'client response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
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
    '/businesses/{businessId}/properties': {
      get: {
        description: 'Returns all properties',
        operationId: 'findProperties',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/offsetParam'
          }, {
            $ref: '#/components/parameters/limitParam'
          }, {
            $ref: '#/components/parameters/orderDirectionParam'
          },
          {
            name: 'clientId',
            in: 'query',
            description: 'filter by client',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'property response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Property'
                      }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        totalCount: {
                          readOnly: true,
                          type: 'number'
                        }
                      }
                    }
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
      },
      post: {
        description: 'Create property',
        operationId: 'createProperty',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          }
        ],
        requestBody: {
          description: 'Create property',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Property'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'property response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Property'
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
    '/businesses/{businessId}/jobs': {
      get: {
        description: 'Returns all jobs',
        operationId: 'findJobs',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/offsetParam'
          }, {
            $ref: '#/components/parameters/limitParam'
          }, {
            $ref: '#/components/parameters/orderDirectionParam'
          },
          {
            name: 'clientId',
            in: 'query',
            description: 'filter by client',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 1
            }
          }
        ],
        responses: {
          200: {
            description: 'job response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Job'
                      }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        totalCount: {
                          readOnly: true,
                          type: 'number'
                        }
                      }
                    }
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
      },
      post: {
        description: 'Create job',
        operationId: 'createJob',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          }
        ],
        requestBody: {
          description: 'Create job',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Job'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'job response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Job'
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
    }
  },
  security: [{
    oauth2: []
  }],
  components: {
    schemas: {
      Business: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'name',
          'timezone',
          'countryCode'
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
          },
          countryCode: {
            type: 'string'
          }
          //         # tag:
          //         #   type: string
          //         # type:
          //         #   $ref: '#/components/schemas/PetType'
        }
      },
      Client: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'businessId'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'number'
          },
          businessId: {
            type: 'number'
          },
          firstName: {
            type: 'string'
          },
          lastName: {
            type: 'string'
          }
        }
      },
      Property: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'clientId'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'number'
          },
          clientId: {
            type: 'number'
          },
          description: {
            type: 'string',
            nullable: true
          },
          address1: {
            type: 'string',
            nullable: true
          },
          address2: {
            type: 'string',
            nullable: true
          },
          city: {
            type: 'string',
            nullable: true
          },
          postalCode: {
            type: 'string',
            nullable: true
          },
          country: {
            type: 'string',
            nullable: true
          }
        }
      },
      Job: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'clientId',
          'propertyId',
          'begins',
          'anytime',
          'closed',
          'invoice'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'number'
          },
          clientId: {
            type: 'number'
          },
          propertyId: {
            type: 'number'
          },
          recurrences: {
            type: 'string',
            nullable: true
          },
          begins: {
            type: 'string'
          },
          ends: {
            type: 'string',
            nullable: true
          },
          startTime: {
            type: 'string',
            nullable: true
          },
          finishTime: {
            type: 'string',
            nullable: true
          },
          anytime: {
            type: 'boolean'
          },
          title: {
            type: 'string',
            nullable: true
          },
          description: {
            type: 'string',
            nullable: true
          },
          closed: {
            type: 'boolean'
          },
          invoice: {
            type: 'string',
            enum: [
              'closed',
              'monthly',
              'never',
              'visit'
            ]
          }
        }
      },
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
    parameters: {
      offsetParam: {
        name: 'offset',
        in: 'query',
        description: 'offset from beginning',
        required: false,
        schema: {
          type: 'integer',
          format: 'int32',
          minimum: 0,
          default: 0
        }
      },
      limitParam: {
        name: 'limit',
        in: 'query',
        description: 'maximum number of results to return',
        required: false,
        schema: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
          maximum: 200,
          default: 20
        }
      },
      orderDirectionParam: {
        name: 'orderDirection',
        in: 'query',
        description: 'Order direction',
        required: false,
        schema: {
          type: 'string',
          enum: [
            'ASC',
            'DESC'
          ]
        }
      },
      idParam: {
        in: 'path',
        name: 'Id',
        schema: {
          type: 'integer',
          minimum: 1
        },
        required: true,
        description: 'Numeric Id of the resource to get'
      },
      businessIdParam: {
        in: 'path',
        name: 'businessId',
        schema: {
          type: 'integer',
          minimum: 1
        },
        required: true,
        description: 'Numeric Id of the business to get'
      }
    },
    securitySchemes: {
      oauth2: {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${process.env.AUTH0_DOMAIN}authorize/?audience=${process.env.AUTH0_IDENTIFIER}`,
            scopes: {
              openid: 'Open Id',
              'create:business': 'Create businesses',
              'read:business': 'Read businesses',
              email: 'Read email address'
            }
          }
        }
      }
    }
  }
}

const openApi = OpenApiValidator.middleware({
  apiSpec: apiSpec,
  validateRequests: {
    removeAdditional: true
  },
  validateResponses: {
    removeAdditional: 'failing'
  }
})

export default openApi
