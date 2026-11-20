// Metro (сборщик JS) с настройками Sentry: у каждого бандла и source map появляется
// Debug ID — по нему Sentry сопоставляет ошибку со строкой исходного кода.
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

module.exports = config;
