const { LOCAL_DIR_NAME, resolvePathFromRootRelative, getConfig, ensureDirExists } = require('@knosys/sdk');
const { DEFAULT_SITE_NAME, DEFAULT_SSG_TYPE, deploySite } = require('@knosys/sdk/src/site');
const { copyJekyllTheme, serveJekyllSite, generateJekyllSite } = require('@knosys/sdk/src/site/generators/jekyll');
const { serveHexoSite, generateHexoSite } = require('@knosys/sdk/src/site/generators/hexo');

module.exports = {
  execute: (subCmd, site = DEFAULT_SITE_NAME) => {
    const config = 'site' in getConfig() ? getConfig(`site.${site}`) : { alias: site, data: '.' };
    const { generator = DEFAULT_SSG_TYPE, source = `./${LOCAL_DIR_NAME}/sites/${site}`, theme } = config;

    let copier;
    let server;
    let deployer;

    if (generator === 'jekyll') {
      copier = copyJekyllTheme;
      server = serveJekyllSite;
      deployer = generateJekyllSite;
    } else if (generator === 'hexo') {
      server = serveHexoSite;
      deployer = generateHexoSite;
    }

    const srcPath = resolvePathFromRootRelative(source);

    ensureDirExists(srcPath);

    if (subCmd === 'copy') {
      if (copier && theme) {
        copier(srcPath, resolvePathFromRootRelative(theme));
      }
    } else if (subCmd === 'serve') {
      if (server) {
        server(srcPath);
      }
    } else if (subCmd === 'deploy') {
      let siteGenerator;

      if (deployer) {
        siteGenerator = distPath => deployer(srcPath, distPath);
      }

      deploySite(site, config, siteGenerator)
    }
  },
};
