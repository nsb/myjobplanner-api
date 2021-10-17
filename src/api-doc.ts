const apiDoc = {
  swagger: '2.0',
  basePath: '/',
  info: {
    title: 'The myJobPlanner API.',
    version: '1.0.0'
  },
  definitions: {
    Business: {
      type: 'object',
      properties: {
        name: {
          description: 'The name of this business.',
          type: 'string'
        }
      },
      required: ['name']
    }
  },
  paths: {}
};

export default apiDoc;