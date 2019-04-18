import React, { Component } from "react";
import "../client/css/Auth.css";

class AuthPage extends Component {
  state = {
    isLogin: true,
    loginData: null
  };

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  async componentDidMount() {
    let loginDataFromLocalStorage = await JSON.parse(
      localStorage.getItem("login")
    );
    if (loginDataFromLocalStorage) {
      this.setState({ loginData: loginDataFromLocalStorage });
    }
  }

  logout = () => {
    this.setState({ loginData: null });
    localStorage.clear();
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            email
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(usersInput: {email: "${email}", password: "${password}"}) {
              email
            }
          }
        `
      };
    }

    fetch("https://server-locker.herokuapp.com/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(async resData => {
        this.setState({loginData:resData.data})
        await localStorage.setItem('login', JSON.stringify(resData.data));

        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { loginData } = this.state;

    return (
      loginData ? (
        <p>{loginData.login.email}
          <button type="button" onClick={this.logout}>
            Logout
          </button>
        </p>
      ) : (
        <div>
        <p>Login</p>

        <form className="auth-form" onSubmit={this.submitHandler}>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input
              className="form-control"
              type="email"
              id="email"
              ref={this.emailEl}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              id="password"
              ref={this.passwordEl}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.switchModeHandler}>
              {this.state.isLogin = "Login"}
            </button>
          </div>
          
        </form>
        </div>
      )
    );
  }
}

export default AuthPage;
