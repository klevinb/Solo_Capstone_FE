import React from 'react';
import { SignIn, SignUp, Nav, Main } from './components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <Nav />
        <Route path='/' exact component={Main} />
        <Route path='/login' exact component={SignIn} />
        <Route path='/register' exact component={SignUp} />
      </div>
    </Router>
  );
}

export default App;
