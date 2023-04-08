import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { FirebaseProvider } from './firebaseConfig';
import store from './store';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';

// import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
// import 'firebase/storage';

// import App from './App';
// import store from './store';
// import firebaseConfig from './firebaseConfig';


//Initialize Firebase
// firebase.initializeApp(firebaseConfig);

const rrfProps = {
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
    enableLogging: false,
  },
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const root = document.getElementById('root');

createRoot(root).render(
<FirebaseProvider>
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>
</FirebaseProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
