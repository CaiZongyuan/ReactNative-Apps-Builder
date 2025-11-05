import schema from '@/instant.schema';
import { init } from '@instantdb/react-native';

export const db = init({
  appId: process.env.EXPO_PUBLIC_INSTANT_APP_ID!,
  schema,
});
