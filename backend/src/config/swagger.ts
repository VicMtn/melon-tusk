import YAML from 'yamljs';

const swaggerDocument = YAML.load('src/docs/swagger.yaml');

export const specs = swaggerDocument; 