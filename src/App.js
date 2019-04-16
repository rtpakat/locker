import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Button, Container } from "reactstrap";
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import LockerViewer from "./components/lockerViewer";
import AuthPage from './components/auth';
import MainNavigation from "./components/MainNavigation";
class App extends Component {
  state = {
    editing: null
  };

  render() {
    const { editing } = this.state;

    return (
      <Container>
        <BrowserRouter>
        <MainNavigation />
          <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
                    
          </Switch>
        </BrowserRouter>

        <LockerViewer
          canEdit={() => true}
          onEdit={post => this.setState({ editing: post })}
        />
      </Container>
    );
  }
}

export default App;
