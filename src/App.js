import React from 'react';
// import logo from './logo.svg';
import './App.css';
import LineGraph from '@chartiful/react-line-graph';
import axios from "axios";
import Select from 'react-select'

const https = require('https');
var exec = require('child_process').exec;
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

const HEADERS = {headers: {
  "x-api-key":"P20NOZjnTP20YCT1WsKAb9pG8o3oVHj25kHK62N1",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
}}
const ENDPOINT = "https://27k379fu03.execute-api.eu-west-1.amazonaws.com/prod/getWearableData"

const DEFAULT_QUERRY = {"activityType": "running","date": "2021-03-13,2021-03-22","columnValues": "AL, CL"}

class App extends React.Component {
    state = {
      mssg: "",
      data: [10,0,-2.5,540]
    };

    handleClick = () => {

      // exec('curl -X POST -H "x-api-key:P20NOZjnTP20YCT1WsKAb9pG8o3oVHj25kHK62N1" -H "Content-Type: application/json" https://27k379fu03.execute-api.eu-west-1.amazonaws.com/prod/getWearableData -d "{\"activityType\": \"running\",\"date\": \"2021-03-13,2021-03-19\",\"columnValues\": \"AL, CL\"}"'
      // , function (error, stdout, stderr) {
      //   console.log('stdout: ' + stdout);
      //   console.log('stderr: ' + stderr);
      //   if (error !== null) {
      //     console.log('exec error: ' + error);
      //   }
      // });
      axios.post(ENDPOINT, DEFAULT_QUERRY, HEADERS)
      axios.post(ENDPOINT, DEFAULT_QUERRY, {
        headers: {
          "x-api-key":"P20NOZjnTP20YCT1WsKAb9pG8o3oVHj25kHK62N1",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
        }
      }
    ).then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      })
      this.setState({ mssg: "Hi there!" });
    };
  
    render() {
      console.log("render() method");
      return (
        <>
          <button onClick={this.handleClick}>Say something</button>
          <div>{this.state.mssg}</div>
          <br/>
          <Select options={activities} />

          <div className="App">
      <LineGraph 
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
      />
      
    </div>
        </>
      );
    }
  }


export default App;
