import React from 'react';
import { SignIn, SignUp, Dashboard, Nav, Main } from './components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  window.scroll({
    behavior: 'smooth',
  });
  return (
    <Router>
      <div className='App'>
        <Nav />
        <Route path='/' exact component={Main} />
        <Route path='/login' exact component={SignIn} />
        <Route path='/register' exact component={SignUp} />
        <Route path='/dashbord' exact component={Dashboard} />
      </div>
    </Router>
  );
}

export default App;
