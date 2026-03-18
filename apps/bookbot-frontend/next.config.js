//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createNextIntlPlugin = require('next-intl/plugin');

// next-intl requires a relative path; resolve it relative to cwd() so it
// works both when Nx processes the graph from the monorepo root and when
// `next dev` runs with cwd set to this app directory.
const i18nConfigPath = './' + path.relative(process.cwd(), path.resolve(__dirname, 'src/i18n/request.ts'));

const withNextIntl = createNextIntlPlugin(i18nConfigPath);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
};

const plugins = [
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
