import React, { Component } from "react";
import gql from "graphql-tag";
import { Query,Mutation } from "react-apollo";
import { Table } from "reactstrap";
import _ from "lodash";

import {
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row
} from "reactstrap";

export const GET_LOCKER = gql`
  query lockers {
    lockers {
      id
      name
      status
      size
    }
  }
`;

export const CHANGE_LOCKER_STATUS = gql`
  mutation changeLockerStatus($lockerId: ID!, $status: Int,$email:String) {
    changeLockerStatus(lockerId: $lockerId, status: $status,email:$email) {
      id
      name
      status
      size
      email
    }
  }
`;

export const GET_SIZE = gql`
  query size($input: String) {
    size(input: $input) {
      price
      nextMinute
    }
  }
`;

export default class postViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      modal: false,
      coins: [1000, 500, 100, 50, 20, 10, 5, 2, 1],
      points: new Array(8),
      locker: {},
      curTime: 0,
      seconds: 0,
      minutes: 0,
      pay: 0,
      changeamount: 0,
      totalSeconds: 0,
      refreshIntervalId: "",
      loginData: null
    };
    this.handleCickReserveLocker = this.handleCickReserveLocker.bind(this);
    this.disableModal = this.disableModal.bind(this);
    this.insertCoin = this.insertCoin.bind(this);
  }

  async componentDidMount() {
    this.state.refreshIntervalId = setInterval(() => {
      this.setState({
        curTime: this.state.totalSeconds++,
        minutes: Math.floor(this.state.curTime / 60)
      });
    }, 1000);
    let loginDataFromLocalStorage = await JSON.parse(
      localStorage.getItem("login")
    );
    if (loginDataFromLocalStorage) {
      this.setState({ loginData: loginDataFromLocalStorage });
    }
    setInterval(() => {
      this.handleCickReserveLocker(this.state.locker,this.state.curTime);
      this.disableModal();
    },60000);
    
  }

  handleCickReserveLocker(locker,minutes) {
    this.setState({ modal: true });
    this.setState({ locker: locker });
    if(locker.size == "s"){
      this.setState({pay:50})
      if(minutes >60){
        this.setState({pay:this.state.pay+25})
      }
    }else if(locker.size == "m"){
      this.setState({pay:100})
      if(minutes >60){
        this.setState({pay:this.state.pay+50})
      }
    }else{
      this.setState({pay:200})
      if(minutes >60){
        this.setState({pay:this.state.pay+100})
      }
    }
  } 

  disableModal() {
    this.setState({ modal: false });
  }

  insertCoin(coin = 0) {
    //TODO: insert coin
    let oldAmount = this.state.amount;
    this.setState({ amount: oldAmount + coin });
  }

  clear() {
    this.setState({ amount: 0 });
    this.setState({ changeamount: 0 });
  }
  reserved(amount) {
    this.state.changeamount = amount - this.state.pay;
    this.setState({ changeamount: amount - this.state.pay });
    var pay = new Array(10);
    var i;

    for (i = 0; i < pay.length; i++) {
      pay[i] = this.state.changeamount / this.state.coins[i];
      pay[i] = Math.floor(pay[i]);
      this.state.changeamount =
        this.state.changeamount - pay[i] * this.state.coins[i];
    }

    alert(
      "_1000: " +
        pay[0] +
        "\r\n" +
        "_500: " +
        pay[1] +
        "\r\n" +
        "_100: " +
        pay[2] +
        "\r\n" +
        "_50: " +
        pay[3] +
        "\r\n" +
        "_20: " +
        pay[4] +
        "\r\n" +
        "_10: " +
        pay[5] +
        "\r\n" +
        "_5: " +
        pay[6] +
        "\r\n" +
        "_2: " +
        pay[7] +
        "\r\n" +
        "_1: " +
        pay[8] +
        "\r\n"
    );
  }

  render() {
    return (
      <div>
        <Query query={GET_LOCKER}>    
          {({ loading, data }) => {
            if(data === undefined || data === null){
              return loading
            }
            let lockerChunked = _.chunk(  data.lockers, 3);
            const { loginData } = this.state;
            return (
              !loading && (
                <Container>
                  <Table>
                    <thead>
                      <tr>
                        <th>S</th>
                        <th>M</th>
                        <th>L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lockerChunked.map((locker, i) => {
                        return (
                          <Mutation mutation={CHANGE_LOCKER_STATUS} key={i}>
                          {(changeLockerStatus, { loading, error,data }) => (
                          <tr key={i}>
                            {locker.map((item, index) => (
                              <td key={index}>
                                {item.status == 0 ? (
                                  <Button
                                  onClick={() => {
                                    changeLockerStatus({ variables: { lockerId:item.id, status: 1,email:loginData ?loginData.login.email:"null" } });
                                    this.setState({curTime:0});
                                    this.setState({minutes:0});
                                    this.setState({pay:0});
                                  }}
                                    color="primary"
                                  >
                                    Reservations
                                  </Button>
                                ) : (
                                  undefined
                                )}
                                {item.status == 1 ? (
                                  <Button
                                    onClick={() => {
                                      this.handleCickReserveLocker(
                                        item,
                                        this.state.minutes
                                      );
                                    }}
                                    color="warning"
                                  >
                                    Pending
                                  </Button>
                                ) : (
                                  undefined
                                )}
                                {item.status == 2 ? (
                                  <Button color="danger">Reserved</Button>
                                ) : (
                                  undefined
                                )}
                              </td>
                            ))}
                          </tr>
                           )}
                           </Mutation>
                        );
                      })}
                    </tbody>
                  </Table>
                  <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <Query
                      query={GET_SIZE}
                      variables={{ input: this.state.locker.size }}
                    >
                      {({ loading, data }) => {
                        
                        let { size } = data;
                        if(data === undefined || data === null){
                          return loading
                        }
                        return (
                          !loading && (
                            <div>
                              <ModalHeader toggle={this.toggle}>
                                Reserve Pay : {this.state.pay} {" -- "}
                                Use Coin : {this.state.amount}{" "}
                              </ModalHeader>
                              <ModalBody>
                                <h4>
                                  minutes : {this.state.minutes} seconds :{" "}
                                  {this.state.curTime}
                                  <div className="float-right">
                                    <Button onClick={() => this.clear()}>
                                      clear
                                    </Button>
                                  </div>
                                </h4>
                                <p>Charge coin:{this.state.changeamount}</p>
                                <p>You are using {this.state.locker.name}</p>
                                <p>
                                  Price: {size.price} THB per hour | next minute
                                  : {size.nextMinute} THB per minute
                                </p>

                                <p>Please insert coin:</p>
                                <Row>
                                  {this.state.coins.map((coin, i) => {
                                    return (
                                      <Col
                                        key={i}
                                        md={4}
                                        className="mt-3 text-center"
                                      >
                                        <Button
                                          key={i}
                                          color="primary"
                                          onClick={() => this.insertCoin(coin)}
                                        >
                                          {coin}
                                        </Button>
                                      </Col>
                                    );
                                  })}
                                </Row>
                              </ModalBody>
                              <ModalFooter>
                              <Mutation mutation={CHANGE_LOCKER_STATUS}>
                          {(changeLockerStatus, { loading }) => (
                          !loading && (
                            <div>
                                 <Button
                                  color="primary"
                                  disabled={this.state.amount < size.price}
                                  onClick={() =>
                                    this.reserved(
                                      this.state.amount,
                                      this.state.locker,
                                      changeLockerStatus({ variables: { lockerId:this.state.locker.id, status: 0,email:loginData ?loginData.login.email:"null"} })
                                    )
                                  }
                                >
                                  Reserve
                                </Button>{" "}
                                <Button
                                  color="secondary"
                                  onClick={this.disableModal}
                                >
                                  Cancel
                                </Button>
                            </div>
                               
                                )
                                )}
                                 </Mutation>
                              </ModalFooter>
                            </div>
                          )
                        );
                      }}
                    </Query>
                  </Modal>
                </Container>  
              )  
            );  
          }}  
        </Query>
      </div>
    );
  }
}
