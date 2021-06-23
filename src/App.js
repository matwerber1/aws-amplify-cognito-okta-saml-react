import './App.css';

import React, { useEffect, useState } from 'react';

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
  
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    Auth.currentAuthenticatedUser()
    .then(user => {
      console.log('Signed in');
      setSignedIn(true);
      setUser(user);
    })
    .catch(() => {
      console.log('Not signed in');
      setSignedIn(false);
      setUser({});
    })
  }, []);

  return (
    <div className="App">
        {
          signedIn
          ?
            <LogoutButton user={user}/>
          :
            <LoginButton/>
        }
    </div>
  );
}

export const LoginButton = () => {
  
  return (
    <div>
      <p>You are not signed in.</p>
      <button onClick={() => Auth.federatedSignIn()}>Login to Hosted UI</button>
    </div>
  )
}

export const LogoutButton = (props) => {
  
  console.log(`User: ${JSON.stringify(props.user,null,2)}`)

  return (
    <div>
      <p>You are signed in as Cognito User Pool ID {props.user.username}</p>
      <button onClick={() => Auth.signOut()}>Sign out</button>
    </div>
  )
}

export default App;
