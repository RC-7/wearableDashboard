import React from 'react';
import './App.css';
import VerticalBarGraph from '@chartiful/react-vertical-bar-graph';
import axios from "axios";
import Select from 'react-select'

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

const defaultActivity = [{value: 'all', label: 'all'},]

const HEADERS = {headers: {
  "x-api-key":"P20NOZjnTP20YCT1WsKAb9pG8o3oVHj25kHK62N1",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
}}
const ENDPOINT = "https://27k379fu03.execute-api.eu-west-1.amazonaws.com/prod/getWearableData"

class App extends React.Component {

    constructor(props){
      super(props)
      let todayDate = new Date()
      this.state = {
        data: [10,0,-2.5,540],
        selectedActivity: 'all',
        selectedColumns: 'AL, CL, vo2Max',
        dateLower : `${todayDate.getFullYear()}-${('0' + todayDate.getMonth()).slice()}-${todayDate.getDate()}`,
        dateUpper: new Date().toISOString().slice(0, 10),
        dataFromAPI: {},
        noDataText: ""
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
        }
      }
    ).then((res) => {
      if (res.data[Object.keys(res.data)[0]].length > 0){
        this.setState({dataFromAPI: res.data, noDataText: ""})
      } else {
        this.setState({dataFromAPI: {}, noDataText: "No data for date range selected"})
      }
      
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      })
    }

    handleRequestData = () => {

      let {selectedActivity, dateLower, dateUpper, selectedColumns } = this.state
      
      this.querryAPI(selectedActivity, `${dateLower}, ${dateUpper}`, selectedColumns)

    };
    handleActivitySelect = (e) => {
      let activities = []
      console.log(e.value)
      for (var activity in e){
        activities.push(e[activity].value)
      }
      this.setState({selectedActivity: e.value})
    }

    handleChangeLowerDate = (e) => {
      this.setState({dateLower: e.target.value});
    }

    handleChangeUpperDate = (e) => {
      this.setState({dateUpper: e.target.value});
    }

    handleChangeColumn = (e) => {
      let columns = ""
      for (var column in e){
        columns += (e[column].value)
      }
      this.setState({selectedColumns: columns})
    }

    generateGraph(data, title){
      let height = window.screen.height *0.5
      let width = window.screen.width*0.7
      return (
        <div>
        <h2 class = 'graph'>{title}</h2>
        <VerticalBarGraph 
        width={width}
        height={height}
        data={data}
        hasXAxisLabels={false}
        style={{
        marginBottom: 30,
        padding: 10,
        paddingTop: 20,
        borderRadius: 20,
        backgroundColor: `#dbf0ef`
      }}
      
      />
      </div>
      )
    }
  
    render() {
      console.log(this.state.selectedActivity)
      let {dataFromAPI, noDataText} = this.state;
      let graphs = []
      for (var key in dataFromAPI){
        graphs.push(this.generateGraph(dataFromAPI[key], key))
      }
      return (
        <>
        <div class="card">
           <h1>Wearable metrics dashboard</h1>
           <h2>Activity</h2>
           <Select 
              width='200px'
              marginBottom="10px"
              classNamePrefix="mySelect"
              options={activities} 
              defaultValue={defaultActivity}
              onChange={this.handleActivitySelect}/>
           <h2 >Metrics to view</h2>
           <Select 
              isMulti
              width='20px'
              marginBottom="10px"
              options={columns} 
              defaultValue={deaultColumns}
              onChange={this.handleChangeColumn}/>
           <h2>Date rage</h2>
           <input type="text" class = "dateSelector" value={this.state.dateLower} padding = '10px' onChange={this.handleChangeLowerDate} />
           <span>to</span>
           <input type="text" class = "dateSelector" value={this.state.dateUpper} onChange={this.handleChangeUpperDate} />
           <button onClick={this.handleRequestData}>Get results</button>
           <div>
              <span>
              {noDataText}
              </span>
           </div>
           {graphs}
        </div>
        </>
      );
    }
  }


export default App;
