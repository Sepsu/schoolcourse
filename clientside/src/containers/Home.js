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
    this.borders = { right: false, left: true};
    this.data = {labels : [], data: []};
    this.cur_ind = 0;
    this.time = {start : 0, end : 60};
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
  scale(time){
    if (time.time === 60){
      this.borders.right = true;
      this.borders.left = true;
    }
    else {
      this.borders.right = false;
      this.borders.left = true;
    }
    console.log("calling scale");
    const {labels, data} = this.props;
    this.data.labels = labels.slice(0,time.time);
    this.data.data = data.slice(0,time.time);
    this.time.start = 0;
    this.time.end = time.time;
    this.forceUpdate();
  }

  move(dir){
    const {labels, data} = this.props;
    console.log(this.time);
    var step = 10;
    //move right
    if (dir){
      if ((this.time.end+step) >= 60)
        this.borders.right = true;
      this.borders.left = false; 
      console.log("moving right ");
    }
    //move left
    else{
      if ((this.time.start-step <= 0))
        this.borders.left = true;
      this.borders.right = false;
      step = -10;
      console.log("moving left ");
    }
    this.time.start += step;
    this.time.end += step;
    console.log(this.time);
    this.data.labels = labels.slice(this.time.start,this.time.end);
    this.data.data = data.slice(this.time.start,this.time.end);
    this.forceUpdate();
  }

  buffering(){

  }

  render() {
    const {info,loading,connected,user,sensors,labels,data} = this.props;
    const times = [10,20,30,40,50,60];
    const chartData = {
      labels : this.data.labels,
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
          data: this.data.data
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
      }



    
    return (
      
      <div className="home">
      {true ? 
        <div className="container">
        <div className="row">
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
            <div className="small-12 medium-4 columns">
              <Panel title="Key Values" icon="glyphicon glyphicon-user">  
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
          <div className="row">
            <div className="small-12 columns">
              <Panel title="Monitor" icon="glyphicon glyphicon-align-left">
                <div className="button-bar">
                  <ul className="button-group small-12">
                  {sensors ? 
                   sensors.map((sen) =>
                    <li key={sen}><a className="button" onClick={this.load1.bind(this,{sen})}>{sen}</a></li>                 
                    ) : ""
                 }
                 </ul>
                 </div>
                 <div className="button-bar">
                 <div className="small-2 columns">
                 {this.borders.left ? <button className="button tiny"></button>  :                  
                   <button className="button tiny" onClick={this.move.bind(this,false)}>left</button>   
                  }
                  </div>
                  <ul className="button-group small-6">  
                   {times.map((time) =>          
                    <li key={time}><a className="button tiny" onClick={this.scale.bind(this,{time})}>{time}</a></li>                 
                    )}
                  </ul>
                  <div className="small-2 columns">
                  {this.borders.right ? <button className="button tiny"></button> : 
                   
                   <button className="button tiny" onClick={this.move.bind(this,true)}>right</button>
                  
                   }
                   </div>
                  </div>
                {info ? info.toString() : 'no info!'}
                
                
                
                <Line
                  data={chartData}
                  options={chartOptions}
                  width=""
                  height="" redraw/>
               
              </Panel>
            </div>
           
          </div>
        </div>
        : ""
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  state = state.toJS();
  return {
    loading: state.loading,
    connected: state.connected,
    user: state.user,
    sensors: state.sensors,
    labels: state.data.labels,
    data: state.data.data
  };
}
export const homeContainer = connect(mapStateToProps,actionCreators)(Home);