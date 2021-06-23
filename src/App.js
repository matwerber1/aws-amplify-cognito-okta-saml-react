import './App.css';

import React, { useEffect, useState } from 'react';
import {AmplifyAuthenticator, AmplifySignIn, AmplifySignOut} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import Amplify, { Auth, Hub } from 'aws-amplify'
import awsconfig from './awsconfig'
import awsauth from './awsauth'

// Solution based on https://medium.com/@georgemccreadie/introduction-to-using-aws-cognito-hosted-ui-with-amplify-js-4711cf4f925a

Amplify.configure(awsconfig)
Auth.configure({ oauth: awsauth })
Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          console.log('sign in', event, data)
          // this.setState({ user: data})
          break
        case 'signOut':
          console.log('sign out')
          // this.setState({ user: null })
          break
        default:
          console.log('Hub Message: ', event);
      }
})

function App() {
  
  const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

  return authState === AuthState.SignedIn && user ? (
      <div className="App">
          <div>Hello, {user.username}</div>
          <AmplifySignOut />
      </div>
    ) : (
      <AmplifyAuthenticator>
        <div slot="sign-in">
          <AmplifySignIn hideSignUp={true}>
            <div slot="federated-buttons">
              <button onClick={() => Auth.federatedSignIn()}>
                Click here to sign in with Okta
              </button>
              <hr />
            </div>
          </AmplifySignIn>
        </div>
      </AmplifyAuthenticator>
  );
  
}

export default App;