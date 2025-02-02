const {
  author,
  license,
  description,
  repository,
  version
} = require('../package.json');

module.exports = {
  name: {
    $: 'Kingdom Come: Deliverance Map Helper',
    en: 'Kingdom Come: Deliverance Map Helper',
    ru: 'Kingdom Come: Deliverance Map Helper'
  },
  description: {
    $: description,
    en: description,
    ru: description
  },
  icon: 'https://cdn2.steamgriddb.com/icon_thumb/1bdde90ebfdef547440410e79b1877bf.png',
  namespace: 'https://greasyfork.org/users/728771',
  downloadURL: '',
  updateURL: '',
  version: version,
  author: author,
  source: repository.url,
  license: license,
  match: [
    'https://kingdomcomemap.github.io/*',
  ],
  require: [  ],
  grant: [
    'unsafeWindow',
    'GM.xmlHttpRequest',

    'GM.cookie',
    'GM_cookie',

    'GM.getValue',
    'GM.setValue',
    'GM.deleteValue',
    'GM.listValues',

    'GM_getValue',
    'GM_setValue',
    'GM_deleteValue',
    'GM_listValues',

    'GM.getResourceText',
    'GM.addStyle'
  ],
  connect: ['kingdomcomemap.github.io'],
  'run-at': 'document-end'
};
