import './style/main.less';

import MapInteractions from './mapInteractions';
import Sidebar from './sidebar';
async function init() {
  const mapInteractions = new MapInteractions(map);
  mapInteractions.init();

  const sidebar = new Sidebar(mapInteractions);
  sidebar.init();
}

async function main() {
  await init();
}

main().catch((e) => {
  console.log(e);
});
