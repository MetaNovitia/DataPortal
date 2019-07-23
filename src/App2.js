import React, {Component} from 'react';
import { Row} from 'reactstrap';
import LineGraph from './Timeline/LineGraph.js'
// import ScatterGraph from './ScatterGraph';
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
import Sample from './Bar/RaceBar.js'

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
        this.changeInput = this.changeInput.bind(this);
        this.changeInnerTab = this.changeInnerTab.bind(this);
        this.switchOption = this.switchOption.bind(this);

        this.tabs = [];
        for(var i in projects){
            this.tabs.push(
                <Tab key={i.toString()+"project"} label={projects[i].title}/>
            );
        }

        this.graphtabs =[];
        for(i in graphTypes){
            this.graphtabs.push(<Tab key={graphTypes[i]} label={graphTypes[i]} icon={graphIcons[i]}/>);
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

    changeInput(event){
        console.log(event)
        if(event.target.name==="curve"){
            this.setState({lineType: event.target.value})
        }else if(event.target.name==="value"){
            this.setState({yValue: event.target.value})
        }else if(event.target.name==="categorize"){
            this.setState({grouping: event.target.value})
        }
    }
    
    changeYValue(event){
    }

    changeGrouping(event){
    }

    render(){

        // --------------------------- Display --------------------------- //
        var value = this.state.value;
        var valueInner = this.state.valueInner;
        var display = ["none","none","none","none"]
        display[valueInner] = "initial"
        var menuItems = [];
        var menuCategoryItems = [];


        // --------------------------- Grouping --------------------------- //
        var groupingdata = require('./data/'+value.toString()+'_group.json');
        var groups = [];
        for(var key in groupingdata){
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

        // ---------------------------- Legend ---------------------------- //
        var displayLegend = "inline-table"
        var legend = [];
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

        // --------------------------- Timeline --------------------------- //
        var timelineData = require('./data/'+value.toString()+'_timeline.json');
        var timelineHeaders = [];
        for(key in timelineData){
            timelineHeaders.push(key);
            menuItems.push(
                <MenuItem key={key} value={key}>{key}</MenuItem>
            );
        }
        if(!timelineData.hasOwnProperty(this.state.yValue)){
            this.state.yValue = timelineHeaders[0];
        }

        // --------------------------- BarGraph --------------------------- //
        var bargraphData = require('./data/'+value.toString()+'_bar.json');
        var bargraphHeaders = [];
        for(key in bargraphData){
            bargraphHeaders.push(key);
            menuItems.push(
                <MenuItem key={key} value={key}>{key}</MenuItem>
            );
        }
        if(!bargraphData.hasOwnProperty(this.state.yValue)){
            this.state.yValue = bargraphHeaders[0];
        }

        // copy keys
        var chosenKeys = [];
        var ckey = bargraphData[this.state.yValue]["keys"].length;
        while(ckey--) chosenKeys[ckey] = bargraphData[this.state.yValue]["keys"][ckey];
        
        var asum = 0;

        for(var yearEntry in bargraphData[this.state.yValue]["data"]){
            for(var entry in bargraphData[this.state.yValue]["data"][yearEntry][1]){
                asum=0;
                for(key in chosenKeys){
                    asum+=bargraphData[this.state.yValue]["data"][yearEntry][1][entry][chosenKeys[key]];
                }

                if(this.state.grouping==="None"){
                    bargraphData[this.state.yValue]["data"][yearEntry][1][entry]["_byIndex"] = true;
                }else{
                    var thiscolor = groupingdata[this.state.grouping][0][
                        groupingdata._index[
                            bargraphData[this.state.yValue]["data"][yearEntry][1][entry].id
                        ]
                    ];
                    bargraphData[this.state.yValue]["data"][yearEntry][1][entry]["_color"] = thiscolor;
                    bargraphData[this.state.yValue]["data"][yearEntry][1][entry]["_byIndex"] = false;
                }

                bargraphData[this.state.yValue]["data"][yearEntry][1][entry]["_total"] = asum;
            }
        }

        // --------------------------- RETURN COMPONENT --------------------------- //
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
                    {this.graphtabs}
                    </Tabs>
                </AppBar>
                <Row style={{width:"100%", margin:"0", padding:"0"}}>
                    <div style={{width:"80%", display:display[0]}}>
                        {<LineGraph
                                    data={timelineData[this.state.yValue].data} 
                                    stacked={this.state.options[0]} 
                                    area={this.state.options[0]}
                                    curve={this.state.lineType}
                                    title={timelineData[this.state.yValue].title}
                                    colors={groupingdata[this.state.grouping][0]}/>}
                    </div>
                    <div style={{width:"80%", display:display[1]}}>
                        {<Sample 
                                    title={bargraphData[this.state.yValue]["title"]}
                                    pkeys={chosenKeys}
                                    dataGenerator={bargraphData[this.state.yValue]["data"]} 
                                    groupMode={this.state.options[0]}
                                    colors={groupingdata[this.state.grouping]}/>}
                    </div>
                    <div style={{height:"70vh", width:"20%", padding:'2%', overflowY: "scroll"}}>
                        <Row style={{display:graphOptions[this.state.valueInner][0],paddingLeft:"10%", marginBottom: "5%"}}>
                            <Switch onColor="#222429" checked={this.state.options[0]} onChange={() => {this.switchOption(0)}} value={this.state.options[0]} />
                            <div style={{marginLeft:"4%", fontFamily:"Verdana"}}>Stacked</div>
                        </Row>
                        <br />
                        <div style={{display:graphOptions[this.state.valueInner][2]}}>
                            <InputLabel shrink htmlFor="curve-label-placeholder">
                            Curve Type
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.state.lineType}
                                onChange={this.changeInput}
                                input={<Input name="curve" id="curve-label-placeholder" />}
                                displayEmpty
                                name="curve"
                            >
                            <MenuItem value={'cardinal'}>Curved</MenuItem>
                            <MenuItem value={'linear'}>Linear</MenuItem>
                            </Select>
                        </div>
                        <br style={{display:graphOptions[this.state.valueInner][2]}}/>
                        <div>
                            <InputLabel shrink htmlFor="value-label-placeholder">
                            Variable
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.state.yValue}
                                onChange={this.changeInput}
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
                                onChange={this.changeInput}
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