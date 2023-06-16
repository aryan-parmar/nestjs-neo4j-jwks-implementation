import * as fs from 'fs';
export const jwtConstants = fs.readFileSync('./key/private.pem');
  