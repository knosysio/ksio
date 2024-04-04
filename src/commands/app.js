const { existsSync } = require('fs');
const { execSync } = require('child_process');

const { getGlobalAppDirPath, initApp } = require('@knosys/sdk/src/app');

function serveApp(config, appSrcDirPath) {
  const envVarStr = config ? `KNOSYS_APP_PATH=${encodeURIComponent(getGlobalAppDirPath(config.name))}` : '';
  const cmds = ['"npm run serve"', `"${envVarStr ? (envVarStr + ' ') : ''}npm run dev"`];

  execSync(`npm run corun ${cmds.join(' ')}`, { stdio: 'inherit', cwd: appSrcDirPath });
}

module.exports = {
  execute: (subCmd = 'serve', appSrcDirPath) => {
    if (subCmd !== 'serve' || !existsSync(appSrcDirPath)) {
      return;
    }

    initApp().then(serveApp, appSrcDirPath);
  },
};
