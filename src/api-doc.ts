const apiDoc = {
  openapi: '3.0.0',
  info: {
    title: 'The myJobPlanner API.',
    description: 'The myJobPlanner API OpenAPI schema',
    version: '1.0.0'
  },
  servers: [{ url: '/' }],
  components: {
    schemas: {
      Business: {
        // type: 'object',
        properties: {
          name: {
            description: 'The name of this business.',
            // type: 'string'
          }
        },
        required: ['name']
      }
    },
  },
  paths: {}
};

export default apiDoc;