import React, {Component, PropTypes} from 'react';

export default
class Panel extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string
  }

  render() {
    return (
      <section className="panel">
        <h3 className="panel-title">
          <span className={this.props.icon + ' icon' } aria-hidden="true"></span>
          {this.props.title}
        </h3>
        <div className="panel-body">
          {this.props.children}
        </div>
      </section>
    );
  }
}
