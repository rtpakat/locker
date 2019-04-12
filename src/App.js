import React, { Component } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Button, Container } from 'reactstrap';
import LockerViewer from './components/lockerViewer';

class App extends Component {
  state = {
    editing: null,
  };

  render() {
    const { editing } = this.state;

    return (
      <Container>
        <LockerViewer
          canEdit={() => true}
          onEdit={(post) => this.setState({ editing: post })}
        />
      </Container>
    );
  }
}

export default App;