import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.undate.undate',
  appName: 'Un Date',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '915483780196-bohkheaav4qm7pp1rq2e54o9rv2iv0sj.apps.googleusercontent.com/',
    },
  },
};

export default config;
