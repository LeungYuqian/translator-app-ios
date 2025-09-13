import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.translator.app',
  appName: 'Translator App',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'Translator App'
  }
};

export default config;
