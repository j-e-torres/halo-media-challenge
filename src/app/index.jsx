import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Todos from './containers/todos';

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Todos} />
      </Switch>
    </BrowserRouter>
  );
}
