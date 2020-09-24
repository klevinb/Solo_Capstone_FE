import React from 'react';
import { SignIn, SignUp } from './components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' exact component={SignIn}></Route>
        <Route path='/register' exact component={SignUp}></Route>
      </div>
    </Router>
  );
}

export default App;
