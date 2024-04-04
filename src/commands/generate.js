const { isPlainObject } = require('@ntks/toolbox');

const { LOCAL_DIR_NAME, resolvePathFromRootRelative, getConfig } = require('@knosys/sdk');
const { DEFAULT_SITE_NAME, DEFAULT_SSG_TYPE } = require('@knosys/sdk/src/site');
const { generateJekyllData } = require('@knosys/sdk/src/site/generators/jekyll');
const { generateHexoData } = require('@knosys/sdk/src/site/generators/hexo');

const generatorMap = {
  jekyll: generateJekyllData,
  hexo: generateHexoData,
};

module.exports = {
  execute: (site = DEFAULT_SITE_NAME, sourceKey = 'default') => {
    const { generator = DEFAULT_SSG_TYPE, source = `./${LOCAL_DIR_NAME}/sites/${site}`, data } = getConfig(`site.${site}`);
    const dataDir = isPlainObject(data) ? data[sourceKey] : data;
    const dataGen = generatorMap[generator];

    if (dataDir && dataGen) {
      dataGen(resolvePathFromRootRelative(source), resolvePathFromRootRelative(dataDir), sourceKey);
    }
  },
};
