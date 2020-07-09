import fs from 'fs';
import path from 'path';
import applyPlugins from './applyPlugins';
// 加载插件
export default function loadPlugins(ctx: any): Promise<void> {
  const { root, rootPkg } = ctx;

  return new Promise<any>((resolve, reject) => {
    // 拿到该包package.json
    fs.readFile(rootPkg, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        const deps = json.dependencies || json.devDependencies || {};
        // 查看规约命名的插件是否存在
        const plugins = Object.keys(deps).filter((name) => {
          if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
            return false;
          }
          const pluginPath = path.join(root, 'node_modules', name);
          return fs.existsSync(pluginPath);
        });
        // 应用插件
        applyPlugins(plugins)(ctx);
        resolve();
      }
    });
  });
}
