
import React, { Component, PropTypes } from 'react';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

 
  chooseSensor() {
    return 0;
  }

  render() {
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
            <ul className="right">
              <li className="active"><a>Refresh</a></li>
              <li className="has-dropdown">
                <a href="#">Sensor 1</a>
                <ul className="dropdown">
                  <li><a onClick={this.chooseSensor}>Sensor 1</a></li>
                  <li><a onClick={this.chooseSensor}>Sensor 2</a></li>
                  <li><a onClick={this.chooseSensor}>Sensor 3</a></li>
                </ul>
              </li>
            </ul>
          </section>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
