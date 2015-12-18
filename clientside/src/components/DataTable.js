import React, {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
export default
class DataTable extends Component {
  mixins: [PureRenderMixin];
  
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
