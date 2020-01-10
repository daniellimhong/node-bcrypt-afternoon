import React, { Component } from 'react';
import './Header.css';
import Axios from 'axios';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      isAdmin: false,
    };
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleUsernameInput(value) {
    this.setState({ username: value });
  }

  handlePasswordInput(value) {
    this.setState({ password: value });
  }

  toggleAdmin() {
    const { isAdmin } = this.state;
    this.setState({ isAdmin: !isAdmin });
  }

  login() {
    // axios POST to /auth/login here
    const { username, password } = this.state;
    Axios
      .post('/auth/login', { username, password })
      .then(user => {
        this.props.updateUser(user.data);
        this.setState({ username: '', password: '' });
      })
      .catch(err => alert(err.response.request.response));
  }

  register() {
    // axios POST to /auth/register here
    const { username, password, isAdmin } = this.state;
    Axios 
      .post('/auth/register', { username, password, isAdmin })
      .then(user => {
        this.setState({ username: '', password: '' });
        this.props.updateUser(user.data);
      })
      .catch(err => {
        this.setState({ username: '', password: '' });
        alert(err.response.request.response);
      })
  }

  logout() {
    // axios GET to /auth/logout here
    Axios
    .get('/auth/logout')
    .then( () => {
      console.log(this.props.user);
      this.props.updateUser({});
    })
    .catch(err => console.log(err));
  }

  render() {
    const { username, password } = this.state;
    const { user } = this.props;
    return (
      <div className="Header">
        <div className="title">Dragon's Lair</div>
        {user.username ? (
          <div className="welcomeMessage">
            <h4>{user.username}, welcome to the dragon's lair</h4>
            <button type="submit" onClick={this.logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="loginContainer">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => this.handleUsernameInput(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => this.handlePasswordInput(e.target.value)}
            />
            <div className="adminCheck">
              <input type="checkbox" id="adminCheckbox" onChange={() => this.toggleAdmin()} /> <span> Admin </span>
            </div>
            <button onClick={this.login}>Log In</button>
            <button onClick={this.register} id="reg">
              Register
            </button>
          </div>
        )}
      </div>
    );
  }
}

