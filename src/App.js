import React from 'react';
import { SignIn, SignUp, Nav, Main, Posts, Profile } from './components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className='App' id='js-top'>
        <Nav />
        <Route path='/' exact component={Main} />
        <Route path='/posts' exact component={Posts} />
        <Route path='/profile' exact component={Profile} />
        <Route path='/login' exact component={SignIn} />
        <Route path='/register' exact component={SignUp} />
      </div>
    </Router>
  );
}
