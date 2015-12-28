
import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actionCreators from '../redux/sensors';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";


export class App extends Component {
  mixins: [PureRenderMixin];

   constructor(props){
    super(props);
    this.userErr = false;
    this.passErr = false;
  }
  
  static propTypes = {
    children: PropTypes.object.isRequired
  }

 
  handleInput(){
      let username = this.refs.username.value;
      let password = this.refs.password.value;
      let fine = true;
      const {connect} = this.props;
      //validation
      if (username === ""){
        console.log("enter valid username");
        this.userErr = true;
        fine = false;
      } else this.userErr = false;
      if (password === ""){
        console.log("enter valid password");
        this.passErr = true;
        fine = false;
      } else this.passErr = false;

      if (fine){
        this.userErr = false;
        this.passErr = false; 
        console.log(username, " ", password);
        connect(username, password);
      }
      //Force rerendering to display the errors
      else {
        this.forceUpdate();
      }
  }
 


  render() {
    const {connected,user,disconnect,connecting} = this.props;

    return (

      <div className="appContent">
        <nav className="top-bar" data-topbar role="navigation">
          <ul className="title-area">
            <li className="name">
              <h1><a href="#">eloSpaces</a></h1>
            </li>
            <li className="toggle-topbar menu-icon"><a href="#"><span></span></a></li>
          </ul>
        </nav>
         <section className="container">
         
            
            {connected ? 
              <div className="row">
              <div className="small-6 columns"><button className="button-success" onClick={disconnect}>Disconnect</button></div>
              </div>
              :
              <div className="row">
              
              <div className="small-6 medium-6 columns own-text">USERNAME:</div>
              <div className="small-6 medium-6 columns">
              <input className="error" ref="username" type="text"/>

              {this.userErr ? 
              <small className="error">Invalid entry</small>
              : ""}
              </div>
              <div className="small-6 medium-6 columns own-text">PASSWORD:</div>
              <div className="small-6 medium-6 columns"><input className="error" ref="password" type="text"/>
              {this.passErr ? 
              <small className="error">Invalid entry</small>
              : ""}

              </div>
              {connecting ?
 <div className="small-6 medium-3 columns-end columns active"><button className="button-success">
<i className="fa fa-spinner fa-spin"/>
  </button></div>
               : 
              <div className="small-6 medium-3 columns-end columns active"><button className="button-success" onClick={this.handleInput.bind(this)}>Connect</button></div>
              }
              </div>

             }
            
          </section>
          
        {this.props.children}
   
      <div className="container">
        <div className="row">
          <div className="small-6 small-offset-6 columns own-text">EXAMPLE FOOTER</div>
        </div>
      </div>
    </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.toJS();
  return {
    loading: state.loading,
    user: state.user,
    connected: state.connected,
    connecting: state.connecting
  };
}
export const appContainer = connect(mapStateToProps,actionCreators)(App);