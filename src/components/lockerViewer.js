import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Table } from "reactstrap";
import _ from "lodash";

import { Button, Container, Row, Col } from "reactstrap";

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


export default class postViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coin: 50
    };
    this.handleCickReserveLocker.bind(this)
  }

  handleCickReserveLocker(){

  }

  insertCoin(coin = 0){
  //TODO: insert coin
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
                              <td key={index}>{item.id}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Container>
              )
            );
          }}
        </Query>
      </div>
    );
  }
}
