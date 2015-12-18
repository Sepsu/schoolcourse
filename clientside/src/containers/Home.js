import React, { Component, PropTypes } from 'react';
import {DataTable,Panel} from '../components';
import { Line } from 'react-chartjs';
import * as actionCreators from '../redux/sensors';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';



export class Home extends Component {

  constructor(props){
    super(props);
    this.cur_sen = null;
  }

  mixins: [PureRenderMixin];

  static propTypes = {
     info: PropTypes.object,
     loading: PropTypes.bool.isRequired,
     user: PropTypes.object,
     labels: PropTypes.array,
     data: PropTypes.array,
     connect: PropTypes.func.isRequired,
   }

  //Dispatch the load action only if new sensor is selected
  load1(sensor) {
      const {load} = this.props;
      if (!this.cur_sen || (this.cur_sen !== sensor.sen)){
        this.cur_sen = sensor.sen;
        console.log("calling load1 with parameter: ", sensor);
        console.log(sensor);
        load(sensor.sen);
      }
      else {
        console.log("sensor already loaded");
        return
      }
   }

  //move this to login...
 connect1() {
      const {connect} = this.props;
      console.log("calling connect");      
      connect("Nakki","joo");  
   }


  render() {
    const {info,loading,user,sensors,labels,data} = this.props;
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
        }
      ],
      loading: loading
    };
    const chartOptions = {
      responsive: true
    };
      let refreshClassName = 'load';
      if (loading) {
      refreshClassName = 'loading';
      };


    
    return (
      
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="small-12 medium-8 columns">
              <Panel title="Monitor" icon="glyphicon glyphicon-align-left">
                <div>
                <nav className="sensor-select">
               
                  <ul className="button-group">
                  {sensors ? 
                   sensors.map((sen) =>
                    <li key={sen}><a className="button tiny" onClick={this.load1.bind(this,{sen})}>{sen}</a></li>                 
                    ) : ""
                 }
                  </ul>

                </nav>
                {info ? info.toString() : 'no info!'}
                <button className={'btn btn-success'} onClick={this.connect1.bind(this)}>
                {refreshClassName}
                </button> 
                <Line
                  data={chartData}
                  options={chartOptions}
                  width="600"
                  height="600" redraw/>
                  </div>
              </Panel>
            </div>
            <div className="small-12 medium-4 columns">
              <Panel title="User" icon="glyphicon glyphicon-user">  
              {user ?           
                <DataTable>
                  <dt>name</dt>
                  <dd>{user.name}</dd>
                  <dt>age</dt>
                  <dd>{user.age}</dd>
                </DataTable>
                  : <div/>
            }
              </Panel>
            </div>
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
    sensors: state.sensors,
    labels: state.data.labels,
    data: state.data.data
  };
}
export const homeContainer = connect(mapStateToProps,actionCreators)(Home);