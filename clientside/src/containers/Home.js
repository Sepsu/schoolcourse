import React, { Component, PropTypes } from 'react';
import {DataTable,Panel} from '../components';
import { Line } from 'react-chartjs';
import * as actionCreators from '../redux/sensors';
import {connect} from 'react-redux';




export class Home extends Component {

  static propTypes = {
     info: PropTypes.object,
     loading: PropTypes.bool.isRequired,
     user: PropTypes.object.isRequired,
     labels: PropTypes.array.isRequired,
     data: PropTypes.array.isRequired,
     load: PropTypes.func.isRequired,
   }

  render() {
    const {info,loading,user,labels,data,load} = this.props; // eslint-disable-line no-shadow
    const chartData = {
      labels,
      // Showing only some of the labels needed for the x-axis but for all tooltips
      datasets: [
        {
          label: 'My Second dataset',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: data
          // No gap for the null data -> needs own tweaking for chartjs
        }
      ]
    };
    const chartOptions = {
      responsive: true
    };
      let refreshClassName = 'load';
      if (loading) {
      refreshClassName = 'loading';
      };

    let load1 = () => {
      load('loading',!loading);
    }

    return (
      
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="small-12 medium-8 columns">
              <Panel title="Monitor" icon="glyphicon glyphicon-align-left">
                <nav className="sensor-select">
                  <ul className="button-group">
                    <li><a className="button tiny">Sensor 1</a></li>
                    <li><a className="button tiny">Sensor 2</a></li>
                    <li><a className="button tiny">Sensor 3</a></li>
                    <li><a className="button tiny">Sensor 4</a></li>
                    <li><a className="button tiny">Sensor 5</a></li>
                  </ul>
                </nav>
                {info ? info.toString() : 'no info!'}
                <button className={'btn btn-success'} onClick={load1}>
                {refreshClassName}
                </button>
                <Line
                  data={chartData}
                  options={chartOptions}
                  width="600"
                  height="250" />
              </Panel>
            </div>
            <div className="small-12 medium-4 columns">
              <Panel title="User" icon="glyphicon glyphicon-user">
                <DataTable>
                  <dt>name</dt>
                  <dd>{user.name}</dd>
                  <dt>age</dt>
                  <dd>{user.age}</dd>
                </DataTable>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  //state = state.toJS();
  console.log(state.getIn(["data", "data"]).toArray());
  return {
    loading: state.get('loading'),
    user: state.get('user').toObject(),
    labels: state.getIn(['data', 'labels']).toArray(),
    data: state.getIn(['data','data']).toArray()
  };
}

export const homeContainer = connect(mapStateToProps,actionCreators)(Home);