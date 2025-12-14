const tuya = require('zigbee-herdsman-converters/lib/tuya');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
  fingerprint: [
    { modelID: 'TS0601', manufacturerName: '_TZE204_tzreobvu' },
    { modelID: 'TS0601', manufacturerName: '_TZE284_mrffaamu' },
    { modelID: 'TS0601', manufacturerName: '_TZE284_8gxmcvpu' },
    { modelID: 'TS0601', manufacturerName: '_TZE204_mrffaamu' },
  ],
  model: 'TOQCB2-JZT-3P',
  vendor: 'Tongou',
  description: 'Smart circuit breaker 3P 63A',
  extend: [
    tuya.modernExtend.tuyaBase({ dp: true }),
  ],
  exposes: [
    tuya.exposes.switch(),
    e.energy(),
    e.power(),
    e.voltage(),
    e.current(),
    e.numeric('current_threshold', ea.STATE_SET)
      .withValueMin(1).withValueMax(63).withValueStep(1).withUnit('A')
      .withDescription('Ampere-grænse'),
  ],
  meta: {
    tuyaDatapoints: [
      [1, 'energy', tuya.valueConverter.divideBy100],
      [6, null, tuya.valueConverter.phaseVariant2WithPhase('a')],
      [16, 'state', tuya.valueConverter.onOff],
      [114, 'current_threshold', tuya.valueConverter.raw],
    ],
  },
};

module.exports = definition;
