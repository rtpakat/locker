import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
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
  mutation changeLockerStatus($lockerId: ID!, $status: Int){
    changeLockerStatus(
      lockerId: $lockerId
      status: $status
    ) {
      id
      name
      status
      size
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
      coins: [1, 2, 5, 10, 20, 50, 100, 500, 1000],
      locker: {},
      charge: 0
    };
    this.handleCickReserveLocker = this.handleCickReserveLocker.bind(this);
    this.disableModal = this.disableModal.bind(this);
    this.insertCoin = this.insertCoin.bind(this);
  }

  handleCickReserveLocker(locker) {
    this.setState({ modal: true });
    this.setState({ locker: locker });

    console.log(this.state.locker);
  }

  handleCheckoutLocker(locker){
    //TODO: Do something here
  }

  disableModal() {
    this.setState({ modal: false });
  }

  insertCoin(coin = 0) {
    //TODO: insert coin
    console.log(coin);
    let oldAmount = this.state.amount;
    this.setState({ amount: oldAmount + coin });
  }

  clear() {
    this.setState({ amount: 0 });
  }

  render() {
    return (
      <div>
        <Query query={GET_LOCKER}>
          {({ loading, data }) => {
            let lockerChunked = _.chunk(data.lockers, 3);
            //  console.log(lockerChunked[0].id)
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
                          <tr key={i}>
                            {locker.map((item, index) => (
                              <td key={index}>
                              {/* <Mutation update={CHANGE_LOCKER_STATUS} variables={{lockerId: this.state.locker.id, status: 1}}> */}
                                {item.status == 0 ? (
                                  <Button
                                    onClick={() => {
                                      this.handleCickReserveLocker(item);
                                    }}
                                    color="default"
                                  >
                                    Aviable
                                  </Button>
                                ) : (
                                  undefined
                                )}
                                {item.status == 1 ? (
                                  <Button color="warning">Pending</Button>
                                ) : (
                                  undefined
                                )}
                                {item.status == 2 ? (
                                  <Button color="danger">Reserved</Button>
                                ) : (
                                  undefined
                                )}
                                {/* </Mutation> */}
                              </td>
                            ))}
                          </tr>
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
                        let {size} = data;
                        return (
                          !loading && (
                            <div>
                    <ModalHeader toggle={this.toggle}>Reserve </ModalHeader>
                    <ModalBody>
                      
                           
                            <h4>
                        Amount : {this.state.amount}{" "}
                        <div className="float-right">
                          <Button onClick={() => this.clear()}>clear</Button>
                        </div>
                      </h4>
                      <p>Charge coin:{this.state.charge}</p>
                      <p>You are using {this.state.locker.name}</p>
                      
                      <p>Price: {size.price} THB per hour | next minute : {size.nextMinute} THB per minute</p>
                      
                      <p>Please insert coin:</p>
                      <Row>
                        {this.state.coins.map((coin, i) => {
                          return (
                            <Col key={i} md={4} className="mt-3 text-center">
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
                      <Button
                        color="primary"
                        disabled={this.state.amount < size.price}
                        onClick={() =>
                          this.reserved(this.state.amount, this.state.locker)
                        }
                      >
                        Reserve
                      </Button>{" "}
                      <Button color="secondary" onClick={this.disableModal}>
                        Cancel
                      </Button>
                    </ModalFooter>
                    </div>
                      ))
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
