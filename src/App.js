import React, {Component} from 'react';
import {Button, Row, Col} from 'reactstrap';
import LineGraph from './LineGraph'
import BarGraph from './BarGraph';
import ScatterGraph from './ScatterGraph';
import projects from './data/projects.json'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LineIcon from '@material-ui/icons/Timeline';
import BarIcon from '@material-ui/icons/Notes';
import ScatterIcon from '@material-ui/icons/ScatterPlot';
import MapIcon from '@material-ui/icons/Map';
import Switch from "react-switch";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Sample from './RaceBar.js'
import "./style.css";

const graphTypes = ["Line", "Bar", "Scatter", "Map"];
const graphIcons = [<LineIcon />,<BarIcon />,<ScatterIcon />,<MapIcon />];
// stacked, area, curve type, rank, stack group, years
const graphOptions = [  ["flex","flex","","none","none","none"],
                        ["flex","none","none","","",""],
                        ["none","none","none","none","none",""],
                        ["none","none","none","none","none",""]];

export default class ScrollableTabs extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: 0, 
            yValue: "", 
            grouping:"",
            lineType: 'cardinal', 
            valueInner:1, 
            options:[true,true,false]};
        this.handleChange = this.handleChange.bind(this);
        this.changeLineType = this.changeLineType.bind(this);
        this.changeYValue = this.changeYValue.bind(this);
        this.changeInnerTab = this.changeInnerTab.bind(this);
        this.changeGrouping = this.changeGrouping.bind(this);
        this.switchOption = this.switchOption.bind(this);

        this.currentGraph = ["None"];

        this.tabs = [];
        for(var i in projects){
            this.tabs.push(
                <Tab key={i.toString()+"project"} label={projects[i].title}/>
            );
        }
        
    }

    changeInnerTab(event, newValue){
        this.setState({valueInner: newValue});
    }

    handleChange(event, newValue) {
        this.setState({value: newValue});
    }

    switchOption(o){
        var opt = this.state.options;
        opt[o] = !opt[o];
        this.setState({options:opt});
    }

    changeLineType(event){
        this.setState({lineType: event.target.value})
    }
    
    changeYValue(event){
        this.setState({yValue: event.target.value})
    }

    changeGrouping(event){
        this.setState({grouping: event.target.value})
    }

    render(){

        var menuItems = [];
        var menuCategoryItems = [];
        var value = this.state.value;
        var valueInner = 0;
        var avail = [];
        var graphtabs = [];

        for(var i in graphTypes){
            avail.push(projects[value].hasOwnProperty(graphTypes[i]));
            if(avail[i]){
                graphtabs.push(<Tab key={graphTypes[i]} label={graphTypes[i]} icon={graphIcons[i]}/>);
            }else{
                graphtabs.push(<Tab style={{display:"none"}} key={graphTypes[i]} label={graphTypes[i]} icon={graphIcons[i]}/>);

            }
        }
        
        if(avail[this.state.valueInner]){
            valueInner = this.state.valueInner;
        }else{
            while(!avail[valueInner]){
                valueInner+=1;
                if(valueInner>=avail.length){
                    valueInner = -1;
                    break;
                }
            }
            this.state.valueInner = valueInner;
        }

        var graph = null;
        var legend = null;
        var displayLegend = "none";

        var groupingdata = require('./data/'+value.toString()+'_group.json');
        var groups = [];
        for(key in groupingdata){
            if(key!=="_index"){
                groups.push(key);
                menuCategoryItems.push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }
        }

        if(!groupingdata.hasOwnProperty(this.state.grouping)){
            this.state.grouping = "None";
        }

        if(this.state.valueInner === 0){
            var data = require('./data/'+value.toString()+'_timeline.json');
            var headers = [];
            for(var key in data){
                headers.push(key);
                menuItems.push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }

            if(!data.hasOwnProperty(this.state.yValue)){
                this.state.yValue = headers[0];
            }

            graph = <div style={{fontFamily:"cambria", height:"70vh", backgroundColor:"white"}}>
                {<LineGraph data={data[this.state.yValue].data} 
                            stacked={this.state.options[0]} 
                            area={this.state.options[1]}
                            curve={this.state.lineType}
                            title={data[this.state.yValue].title}
                            colors={groupingdata[this.state.grouping][0]}/>}
            </div>
            displayLegend = "inline-table"
            legend = []
            
            var colorcode = groupingdata[this.state.grouping][1];
            for(var item in colorcode){
                legend.push(
                    <Row key={item} style={{margin:"0", alignItems:"center"}}>
                        <div style={{
                            margin: "10px",
                            width: "10px", height:"10px", 
                            backgroundColor:colorcode[item]}}></div>
                        <div>{item}</div>
                    </Row>
                );
            }

            legend.reverse();

        }else if(this.state.valueInner === 1){
            /*
            graph = <div style={{fontFamily:"cambria", height:"70vh", backgroundColor:"white"}}>
                {<BarGraph data={require('./data/'+value.toString()+'_bar.json')} stacked={this.state.options[0]}/>}
            </div>*/

            var data = require('./data/'+value.toString()+'_bar.json');
            var headers = [];
            for(var key in data){
                headers.push(key);
                menuItems.push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }

            if(!data.hasOwnProperty(this.state.yValue)){
                this.state.yValue = headers[0];
            }

            var chosenKeys = ["value","burger"];

            var asum = 0;

            for(var yearEntry in data[this.state.yValue]["data"]){
                for(var entry in data[this.state.yValue]["data"][yearEntry][1]){
                    asum=0;
                    for(var key in chosenKeys){
                        asum+=data[this.state.yValue]["data"][yearEntry][1][entry][chosenKeys[key]];
                    }

                    if(this.state.grouping==="None"){
                        data[this.state.yValue]["data"][yearEntry][1][entry]["_byIndex"] = true;
                    }else{
                        var thiscolor = groupingdata[this.state.grouping][0][
                            groupingdata._index[
                                data[this.state.yValue]["data"][yearEntry][1][entry].id
                            ]
                        ];
                        data[this.state.yValue]["data"][yearEntry][1][entry]["_color"] = thiscolor;
                        data[this.state.yValue]["data"][yearEntry][1][entry]["_byIndex"] = false;
                    }

                    data[this.state.yValue]["data"][yearEntry][1][entry]["_total"] = asum;
                }
            }

            graph = <Sample 
                    title={data[this.state.yValue]["title"]}
                    pkeys={chosenKeys}
                    dataGenerator={data[this.state.yValue]["data"]} 
                    groupMode={this.state.options[0]}
                    colors={groupingdata[this.state.grouping]}/>

                    displayLegend = "inline-table"
                    legend = []
                    
            if(this.state.grouping!=="None"){
                var colorcode = groupingdata[this.state.grouping][1];
                for(var item in colorcode){
                    legend.push(
                        <Row key={item} style={{margin:"0", alignItems:"center"}}>
                            <div style={{
                                margin: "10px",
                                width: "10px", height:"10px", 
                                backgroundColor:colorcode[item]}}></div>
                            <div>{item}</div>
                        </Row>
                    );
                }
                legend.reverse();
            }

        }else if(this.state.valueInner === 2){
            graph = <div style={{fontFamily:"cambria", height:"70vh", backgroundColor:"white"}}>
                {<ScatterGraph data={require('./data/'+value.toString()+'_scatter.json')} />}
            </div>
        }

        return (
            <div style={{
                flexGrow: 1,
                width: '100%',
                backgroundColor: "white",
            }}>
                <AppBar position="static" color="default">
                    <Tabs
                    TabIndicatorProps={{style: {backgroundColor: 'black'}}}
                    value={value}
                    onChange={this.handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="inherit"
                    >
                    {this.tabs}
                    </Tabs>
                </AppBar>

                <AppBar position="static">
                    <Tabs
                        TabIndicatorProps={{style: {backgroundColor: 'black'}}}
                        value={valueInner}
                        onChange={this.changeInnerTab}
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="inherit"
                        style={{background:"gray"}}
                        >
                    {graphtabs}
                    </Tabs>
                </AppBar>
                <Row style={{width:"100%", margin:"0", padding:"0"}}>
                    <div style={{width:"80%"}}>
                        {graph}
                    </div>
                    <div style={{height:"70vh", width:"20%", padding:'2%', overflowY: "scroll"}}>
                        <Row style={{display:graphOptions[this.state.valueInner][0],paddingLeft:"10%", marginBottom: "5%"}}>
                            <Switch onColor="#222429" checked={this.state.options[0]} onChange={() => {this.switchOption(0)}} value={this.state.options[0]} />
                            <div style={{marginLeft:"4%", fontFamily:"Verdana"}}>Stacked</div>
                        </Row>
                        <Row style={{display:graphOptions[this.state.valueInner][1],paddingLeft:"10%", marginBottom: "5%"}}>
                            <Switch onColor="#222429" checked={this.state.options[1]} onChange={() => {this.switchOption(1)}} value={this.state.options[1]} />
                            <div style={{marginLeft:"4%", fontFamily:"Verdana"}}>Area</div>
                        </Row>
                        <br />
                        <div style={{display:graphOptions[this.state.valueInner][2]}}>
                            <InputLabel shrink htmlFor="curve-label-placeholder">
                            Curve Type
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.state.lineType}
                                onChange={this.changeLineType}
                                input={<Input name="curve" id="curve-label-placeholder" />}
                                displayEmpty
                                name="curve"
                            >
                            <MenuItem value={'basis'}>Basis</MenuItem>
                            <MenuItem value={'cardinal'}>Cardinal</MenuItem>
                            <MenuItem value={'linear'}>Linear</MenuItem>
                            <MenuItem value={'natural'}>Natural</MenuItem>
                            </Select>
                        </div>
                        <br style={{display:graphOptions[this.state.valueInner][2]}}/>
                        <div>
                            <InputLabel shrink htmlFor="value-label-placeholder">
                            Dependent Value
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.state.yValue}
                                onChange={this.changeYValue}
                                input={<Input name="value" id="value-label-placeholder" />}
                                displayEmpty
                                name="value"
                            >
                                {menuItems}
                            </Select>
                        </div>
                        <br />
                        <div>
                            <InputLabel shrink htmlFor="categorize-label-placeholder">
                            Categorize
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.state.grouping}
                                onChange={this.changeGrouping}
                                input={<Input name="categorize" id="categorize-label-placeholder" />}
                                name="categorize"
                            >
                                {menuCategoryItems}
                            </Select>
                        </div>
                        <br />
                        <div>
                            <div style={{
                                        display:displayLegend, 
                                        backgroundColor:"lightGray",
                                        width: "100%",
                                        borderRadius: "2px",
                                        fontFamily:"Georgia"
                                    }}>
                                {legend}
                            </div>
                        </div>
                    </div>
                </Row>
                <br />
            </div>
        );
    }
}