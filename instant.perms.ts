// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from '@instantdb/react-native';

const rules = {
  $default: {
    allow: {
      $default: 'true',
    },
  },
  $users: {
    allow: {
      view: 'auth.id == data.id',
      create: 'false',
      update: 'false',
      delete: 'false',
    },
  },
  // builds: {
  // bind: [
  //   'isOwner',
  //   'auth.id != null && auth.id == data.owner',
  //   'isStillOwner',
  //   'auth.id != null && auth.id == newData.owner',
  //   'isAdmin',
  //   "auth.email != null && auth.email.endsWith('@galaxies.dev')",
  // ],
  // allow: {
  //   view: 'true',
  //   create: 'isOwner',
  //   update: 'isOwner && isStillOwner',
  //   delete: 'isOwner || isAdmin',
  // },
  // },
} satisfies InstantRules;

export default rules;
