import { merge } from 'lodash';

import { development } from './development';
import { production } from './production';
import { test } from './test';
import { testlocal } from './testlocal';

const all = {
  env: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
  ip: process.env.IP || '0.0.0.0'
};

export const config: any = merge(all, _getEnvironmentConfig());

function _getEnvironmentConfig() {
  if (all.env === 'development') {
    return development;
  } else if (all.env === 'production') {
    return production;
  } else if (all.env === 'test') {
    return test;
  } else if (all.env === 'testlocal') {
    return testlocal;
  } else {
    return development;
  }
}
