import React, {Component, PropTypes} from 'react';

export default
class DataTable extends Component {

  static propTypes = {
    children: PropTypes.array.isRequired,
  }

  render() {

    return (
      <dl className="datatable">
        {this.props.children}
      </dl>
    );
  }
}
