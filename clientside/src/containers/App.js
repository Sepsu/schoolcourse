
import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actionCreators from '../redux/sensors';
import {connect} from 'react-redux';

export class App extends Component {
  mixins: [PureRenderMixin];
  
  static propTypes = {
    children: PropTypes.object.isRequired
  }

 
  handleInput(){
      let username = this.refs.username.value;
      let password = this.refs.password.value;
      const {connect} = this.props;
      //validation
      if (username === "" || password === ""){
        console.log("enter valid username and password");
      }
      else{ 
        console.log(username, " ", password);
        connect(username, password);
      }
  }
 


  render() {
    const {connected,user,disconnect} = this.props;

    return (
      <div className="appContent">
        <nav className="top-bar" data-topbar role="navigation">
          <ul className="title-area">
            <li className="name">
              <h1><a href="#">eloSeed</a></h1>
            </li>
            <li className="toggle-topbar menu-icon"><a href="#"><span></span></a></li>
          </ul>

          <section className="top-bar-section">
            
            {connected ? 
              <ul className="tittle-area">
              <li className="name"><h1>User {user.name} connected</h1></li>
              <li className="active" onClick={disconnect}><a>Disconnect</a></li>
              </ul>
              :
              <ul className="center">
              <li className="name"><h1>USERNAME:</h1></li>
              <li className="active"><input ref="username" type="text"/></li>
              <li className="name"><h1>PASSWORD:</h1></li>
              <li className="active"><input ref="password" type="text"/></li>
              <li className="active" onClick={this.handleInput.bind(this)}><a>Connect</a></li>
              </ul>
             }
            
          </section>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.toJS();
  return {
    loading: state.loading,
    user: state.user,
    connected: state.connected
  };
}
export const appContainer = connect(mapStateToProps,actionCreators)(App);