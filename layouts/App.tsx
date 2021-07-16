import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import loadable from '@loadable/component';
import { WorkspaceContextProvider } from '@contexts/WorkspaceContext';

const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact path="/" to="/login" />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <WorkspaceContextProvider>
          <Route path="/workspace/:workspace" component={Workspace} />
        </WorkspaceContextProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
