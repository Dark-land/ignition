'use client';

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['https://main.d1zdbaqgt8ze4i.amplifyapp.com/api/auth/callback'],
          redirectSignOut: ['https://main.d1zdbaqgt8ze4i.amplifyapp.com/'],
          responseType: 'code',
        }
      }
    }
  }
}, { ssr: true });

export default function ConfigureAmplify() {
  return null;
}
