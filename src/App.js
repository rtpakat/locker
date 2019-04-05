import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container } from "reactstrap";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lockers: [
        {s: [
          {id: 1, status: 1},
          {id: 4, status: 1},
          {id: 7, status: 1},
          {id: 10, status: 1}
        ]},
        {m: [
          {id: 2, status: 1},
          {id: 5, status: 1},
          {id: 8, status: 1},
          {id: 11, status: 1}
        ]},
        {l: [
          {id: 3, status: 1},
          {id: 6, status: 1},
          {id: 9, status: 1},
          {id: 12, status: 1}
        ]},
        
      ]
    };
  }

  loopFor(){
    let arrayLength = this.state.lockers.length - 1;
    let newArray = [];
    this.state.lockers.forEach((locker, i) => {
      // console.log(locker.s);
      // this.state.lockers[i].forEach((lockerInside, j) => {
        
      // })
    })
    for (var key in this.state.lockers) {
      var obj = this.state.lockers[key];
      console.log(obj);
      var jsonData = JSON.parse(obj);
      for (var i = 0; i < jsonData.lockers.length; i++) {
        var counter = jsonData.lockers[i];
        console.log(counter);
    }
      // ...
    }
    // console.log(newArray)
    
  }

  render() {
    return (
      <div className="container">
        <h1>Coin Locker</h1>
        <table className="table">
          <thead>
            <tr>
              <th>S</th>
              <th>M</th>
              <th>L</th>
            </tr>
          </thead>
          <tbody>
           
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
            </tr>
            <tr>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
            <tr>
              <td>7</td>
              <td>8</td>
              <td>9</td>
            </tr>
            <tr>
              <td>10</td>
              <td>11</td>
              <td>12</td>
            </tr>
          </tbody>
        </table>
        <Button onClick={() => this.loopFor()}>Test</Button>
      </div>
    );
  }
}

export default App;
