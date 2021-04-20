import React from 'react';
// import logo from './logo.svg';
import './App.css';
import VerticalBarGraph from '@chartiful/react-vertical-bar-graph';
import axios from "axios";
import Select from 'react-select'

// const https = require('https');
// var exec = require('child_process').exec;
const activities =[
  {value: 'all', label: 'all'},
  {value: 'boating', label: 'boating'},
  {value: 'cycling', label: 'cycling'},
  {value: 'indoor_cardio', label: 'indoor_cardio'},
  {value: 'indoor_cycling', label: 'indoor_cycling'},
  {value: 'lap_swimming', label: 'lap_swimming'},
  {value: 'mountain_biking', label: 'mountain_biking'},
  {value: 'multi_sport', label: 'multi_sport'},
  {value: 'open_water_swimming', label: 'open_water_swimming'},
  {value: 'running', label: 'running'},
  {value: 'strength_training', label: 'strength_training'},
  {value: 'tennis', label: 'tennis'},
  {value: 'track_running', label: 'track_running'},
  {value: 'trail_running', label: 'trail_running'},
  {value: 'treadmill_running', label: 'treadmill_running'},
  {value: 'virtual_ride', label: 'virtual_ride'},
  {value: 'walking', label: 'walking'},
  {value: 'whitewater_rafting_kayaking', label: 'whitewater_rafting_kayaking'},
  {value: 'yoga', label: 'yoga'},
  {value: 'other', label: 'other'},
]

const columns = [
  {value: 'maxHRAge', label: 'maxHRAge'},
  {value: 'duration_mins', label: 'duration_mins'},
  {value: 'maxHR', label: 'maxHR'},
  {value: 'averageHR', label: 'averageHR'},
  {value: 'averageSpeed', label: 'averageSpeed'},
  {value: 'totalKilocalories', label: 'totalKilocalories'},
  {value: 'lactateThresholdBpm', label: 'lactateThresholdBpm'},
  {value: 'lactateThresholdSpeed', label: 'lactateThresholdSpeed'},
  {value: 'restingHeartRate', label: 'restingHeartRate'},
  {value: 'TSS', label: 'TSS'},
  {value: 'vo2Max', label: 'vo2Max'},
  {value: 'AL', label: 'AL'},
  {value: 'CL', label: 'CL'},
]

const deaultColumns = [{value: 'vo2Max', label: 'vo2Max'},
  {value: 'AL', label: 'AL'},
  {value: 'CL', label: 'CL'}
];

const HEADERS = {headers: {
  "x-api-key":"x-api-key",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
}}
const ENDPOINT = "https://api/endpoint"

const DEFAULT_QUERRY = {"activityType": "running","date": "2021-03-13,2021-03-22","columnValues": "AL, CL"}

class App extends React.Component {

    constructor(props){
      super(props)
      this.state = { // Tie all state to what we display and then allow button press to set default values for different activities
        data: [10,0,-2.5,540],
        selectedActivities: [],
        selectedColumns: 'AL, CL, vo2Max',
        dateLower : "2018-03-11",
        dateUpper: "2021-03-22",
        dataFromAPI: {}
      };
    }

    querryAPI(activityType, dateRange, ColumnsToQuerry) {
      let querry = {
      "date": dateRange,
      "columnValues": ColumnsToQuerry}

      if (activityType !== 'all') querry['activityType'] = activityType
      axios.post(ENDPOINT, querry, {
        headers: {
          "x-api-key":"P20NOZjnTP20YCT1WsKAb9pG8o3oVHj25kHK62N1",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
        }
      }
    ).then((res) => {
        this.setState({dataFromAPI: res.data})
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      })
    }

    handleClick = () => {

      let {selectedActivities, dateLower, dateUpper, selectedColumns } = this.state
      for (var selectedActivity in selectedActivities){
        this.querryAPI(selectedActivities[selectedActivity], `${dateLower}, ${dateUpper}`, selectedColumns)
      }

    };
    handleChange = (e) => {
      let activities = []
      for (var activity in e){
        // console.log(activity)
        activities.push(e[activity].value)
      }
      // console.log(activities)
      this.setState({selectedActivities: activities})
    }

    handleChangeLower = (e) => {
      this.setState({dateLower: e.target.value});
    }

    handleChangeUpper = (e) => {
      this.setState({dateUpper: e.target.value});
    }

    handleChangeColumn = (e) => {
      // console.log(e)
      let columns = ""
      for (var column in e){
        columns += (e[column].value)
      }
      // console.log(columns)
      this.setState({selectedColumns: columns})
    }

    generateGraph(data){

      const config = {
        // startAtZero: false,
        // hasXAxisBackgroundLines: false,
        // hasXAxisLabels: false,
        // xAxisLabelStyle: {
        //   prefix: '$',
        //   offset: 0
        // }
      };
      return (
        <VerticalBarGraph 
        width={500}
        height={300}
        data={data}
        // labels={[]}
        hasXAxisLabels={false}
        baseConfig={config}
        style={{
        marginBottom: 30,
        padding: 10,
        paddingTop: 20,
        borderRadius: 20,
        // width: 500,
        backgroundColor: `#dbf0ef`
      }}
      
      />
      )
    }
  
    render() {
      // console.log(this.state);
      let {dataFromAPI} = this.state;
      let graphs = []
      for (var key in dataFromAPI){
        graphs.push(this.generateGraph(dataFromAPI[key]))
      }
      return (
        <>
          <button onClick={this.handleClick}>Say something</button>
          <div>{this.state.mssg}</div>
          <br/>
          <Select 
          isMulti
          width='200px'
          options={activities} 
          onChange={this.handleChange}/>

        <Select 
          isMulti
          width='200px'
          options={columns} 
          defaultValue={deaultColumns}
          onChange={this.handleChangeColumn}/>

          <input type="text" value={this.state.dateLower} onChange={this.handleChangeLower} />

          <input type="text" value={this.state.dateUpper} onChange={this.handleChangeUpper} />

          <div className="App">
      {/* <LineGraph 
      width={500}
      height={300}
      data={this.state.data}
      style={{
        marginBottom: 30,
        padding: 10,
        paddingTop: 20,
        borderRadius: 20,
        width: 500,
        backgroundColor: `#dbf0ef`
      }}
      /> */}

      <div/>
      {graphs}
      
    </div>
        </>
      );
    }
  }


export default App;
