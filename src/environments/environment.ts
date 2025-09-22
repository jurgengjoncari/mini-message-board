import { commonConfig } from './environment.common';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  ...commonConfig
}
