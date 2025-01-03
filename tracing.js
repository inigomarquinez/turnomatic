// tracing.js
'use strict';
require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it is working

const { HoneycombSDK } = require('@honeycombio/opentelemetry-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

// uses the HONEYCOMB_API_KEY and OTEL_SERVICE_NAME environment variables
const sdk = new HoneycombSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      // we recommend disabling fs autoinstrumentation since it can be noisy
      // and expensive during startup
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

sdk.start();