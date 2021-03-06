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
          201: {
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
      },
      put: {
        description: 'Updates a single business',
        operationId: 'updateBusiness',
        parameters: [{
          $ref: '#/components/parameters/idParam'
        }],
        responses: {
          200: {
            description: 'update business response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Business'
                }
              }
            }
          },
          404: {
            description: 'update business not found',
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
          201: {
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
    '/businesses/{businessId}/clients/{Id}': {
      get: {
        description: 'Returns a single client',
        operationId: 'getClients',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }],
        responses: {
          200: {
            description: 'get client response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
                }
              }
            }
          },
          404: {
            description: 'get client not found',
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
      },
      put: {
        description: 'Update client',
        operationId: 'updateClient',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }
        ],
        requestBody: {
          description: 'Update client',
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
    '/businesses/{businessId}/employees': {
      get: {
        description: 'Returns all employees',
        operationId: 'findEmployees',
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
            description: 'employee response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Employee'
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
        description: 'Create employee',
        operationId: 'createEmployee',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          }
        ],
        requestBody: {
          description: 'Create employee',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Employee'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'employee response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Employee'
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
    '/businesses/{businessId}/employees/{Id}': {
      get: {
        description: 'Returns a single employee',
        operationId: 'getEmployee',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }],
        responses: {
          200: {
            description: 'get employee response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Employee'
                }
              }
            }
          },
          404: {
            description: 'get employee not found',
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
      },
      put: {
        description: 'Update client',
        operationId: 'updateClient',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }
        ],
        requestBody: {
          description: 'Update client',
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
            name: 'client',
            in: 'query',
            description: 'filter by client',
            required: false,
            schema: {
              type: 'string',
              pattern: '^/businesses/\\d+/clients/\\d+$'
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
          201: {
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
    '/businesses/{businessId}/properties/{Id}': {
      get: {
        description: 'Returns a single property',
        operationId: 'getProperties',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }],
        responses: {
          200: {
            description: 'get property response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Property'
                }
              }
            }
          },
          404: {
            description: 'get property not found',
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
      },
      put: {
        description: 'Update property',
        operationId: 'updateProperty',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }
        ],
        requestBody: {
          description: 'Update property',
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
            name: 'client',
            in: 'query',
            description: 'filter by client',
            required: false,
            schema: {
              type: 'string',
              pattern: '^/businesses/\\d+/clients/\\d+$'
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
          201: {
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
    },
    '/businesses/{businessId}/jobs/{Id}': {
      get: {
        description: 'Returns a single job',
        operationId: 'getJobs',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }],
        responses: {
          200: {
            description: 'get job response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Job'
                }
              }
            }
          },
          404: {
            description: 'get job not found',
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
      },
      put: {
        description: 'Update job',
        operationId: 'updateJob',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }
        ],
        requestBody: {
          description: 'Update job',
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
    },
    '/businesses/{businessId}/visits': {
      get: {
        description: 'Returns all visits',
        operationId: 'findVisits',
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
            name: 'client',
            in: 'query',
            description: 'filter by client',
            required: false,
            schema: {
              type: 'string',
              pattern: '^/businesses/\\d+/clients/\\d+$'
            }
          },
          {
            name: 'job',
            in: 'query',
            description: 'filter by job',
            required: false,
            schema: {
              type: 'string',
              pattern: '^/businesses/\\d+/jobs/\\d+$'
            }
          }
        ],
        responses: {
          200: {
            description: 'visit response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Visit'
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
        description: 'Create visit',
        operationId: 'createVisit',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          }
        ],
        requestBody: {
          description: 'Create visit',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Visit'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'visit response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Visit'
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
    '/businesses/{businessId}/visits/{Id}': {
      get: {
        description: 'Returns a single visit',
        operationId: 'getVisits',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }],
        responses: {
          200: {
            description: 'get visit response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Visit'
                }
              }
            }
          },
          404: {
            description: 'get visit not found',
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
      },
      put: {
        description: 'Update visit',
        operationId: 'updateVisit',
        parameters: [
          {
            $ref: '#/components/parameters/businessIdParam'
          },
          {
            $ref: '#/components/parameters/idParam'
          }
        ],
        requestBody: {
          description: 'Update visit',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Visit'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'visit response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Visit'
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
            type: 'string',
            pattern: '^/businesses/\\d+$'
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
          'business'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'string',
            pattern: '^/businesses/\\d+/clients/\\d+$'
          },
          business: {
            type: 'string',
            pattern: '^/businesses/\\d+$'
          },
          firstName: {
            type: 'string',
            nullable: true
          },
          lastName: {
            type: 'string',
            nullable: true
          }
        }
      },
      Property: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'client'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'string',
            pattern: '^/businesses/\\d+/properties/\\d+$'
          },
          client: {
            type: 'string',
            pattern: '^/businesses/\\d+/clients/\\d+$'
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
          'client',
          'property',
          'begins',
          'anytime',
          'closed',
          'invoice',
          'lineItems',
          'assigned'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'string',
            pattern: '^/businesses/\\d+/jobs/\\d+$'
          },
          client: {
            type: 'string',
            pattern: '^/businesses/\\d+/clients/\\d+$'
          },
          property: {
            type: 'string',
            pattern: '^/businesses/\\d+/properties/\\d+$'
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
          },
          lineItems: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/LineItem'
            }
          },
          assigned: {
            type: 'array',
            items: {
              type: 'string',
              pattern: '^/businesses/\\d+/employees/\\d+$'
            }
          }
        }
      },
      LineItem: {
        additionalProperties: false,
        type: 'object',
        required: [
          'quantity'
        ],
        properties: {
          id: {
            type: 'string',
            pattern: '^/businesses/\\d+/lineitems/\\d+$'
          },
          serviceId: {
            type: 'string',
            pattern: '^/businesses/\\d+/services/\\d+$',
            nullable: true
          },
          name: {
            type: 'string'
          },
          description: {
            type: 'string',
            nullable: true
          },
          quantity: {
            type: 'number'
          },
          unitCost: {
            type: 'number'
          }
        }
      },
      Visit: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'job',
          'completed',
          'begins',
          'anytime',
          'lineItems'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'string',
            pattern: '^/businesses/\\d+/visits/\\d+$'
          },
          job: {
            type: 'string',
            pattern: '^/businesses/\\d+/jobs/\\d+$'
          },
          invoice: {
            type: 'string',
            pattern: '^/businesses/\\d+/invoices/\\d+$',
            nullable: true,
            readOnly: true
          },
          completed: {
            type: 'boolean'
          },
          begins: {
            type: 'string'
          },
          ends: {
            type: 'string',
            nullable: true
          },
          anytime: {
            type: 'boolean'
          },
          lineItems: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/LineItem'
            }
          }
        }
      },
      Employee: {
        additionalProperties: false,
        type: 'object',
        required: [
          'id',
          'user',
          'business',
          'role'
        ],
        properties: {
          id: {
            readOnly: true,
            type: 'string',
            pattern: '^/businesses/\\d+/employees/\\d+$'
          },
          business: {
            readOnly: true,
            type: 'string',
            pattern: '^/businesses/\\d+$'
          },
          role: {
            type: 'string',
            enum: [
              'admin',
              'worker'
            ]
          }
        }
      },
      Error: {
        type: 'object',
        required: [
          'message'
        ],
        properties: {
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
              read: 'Read access',
              write: 'Write access',
              email: 'Read email address'
            }
          }
        }
      }
    }
  }
}

const openApi = OpenApiValidator.middleware({
  apiSpec,
  validateRequests: {
    removeAdditional: true
  },
  validateResponses: {
    removeAdditional: 'failing'
  }
})

export default openApi
