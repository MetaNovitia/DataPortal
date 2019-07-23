import React, {Component} from 'react';
import { Row} from 'reactstrap';
import LineGraph from '../Timeline/LineGraph.js'
// import ScatterGraph from './Scatter/ScatterGraph';
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
import Sample from '../Bar/RaceBar.js'
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const graphTypes = ["Line", "Bar", "Scatter", "Map"];
const graphIcons = [<LineIcon />,<BarIcon />,<ScatterIcon />,<MapIcon />];
// stacked, area, curve type, rank, stack group, years
const graphOptions = [  ["flex","flex","","none","none","none"],
                        ["flex","none","none","","",""],
                        ["none","none","none","none","none",""],
                        ["none","none","none","none","none",""]];

export default class Topic extends Component {

    constructor(props){
        super(props);
        this.options = {
            "category" : "",
            "variable" : ["","","",""],
            "curve" : "cardinal",
            "normalize" : ["","","",""],
            stacked : true,
            selectedKeys:{},
            selectedVariables:{}
        }
        this.state = {graphIndex:0};
        this.changeInput = this.changeInput.bind(this);
        this.changeInnerTab = this.changeInnerTab.bind(this);
        this.checkBox = this.checkBox.bind(this);
        this.topicIndex = -1;
        this.menuCategoryItems = [];
        this.menuVariableItems = [[],[],[],[]];
        this.menuNormalizerItems = [];
        this.legend = [];
        this.colors = [];
        this.displayLegend = "none"
        this.filteredtimelineData = [];
        this.normalizedata = {};

        this.graphtabs =[];
        for(var i in graphTypes){
            this.graphtabs.push(<Tab key={graphTypes[i]} label={graphTypes[i]} icon={graphIcons[i]}/>);
        }
        
    }

    checkBox(event, checked){
        this.options.selectedKeys[event.target.name] = checked;
        this.setState({});
    }

    changeInnerTab(event, newValue){
        this.setState({graphIndex: newValue});
    }

    changeInput(event){
        if(event==="stacked"){
            this.options.stacked = !this.options.stacked
        }else{
            if( event.target.name==="variable" || 
                event.target.name==="normalize"){
                this.options[event.target.name][this.state.graphIndex] = event.target.value;
            }else{
                this.options[event.target.name] = event.target.value;
            }
        }
        this.setState({})
    }

    render(){

        // ---------------------------- Init ---------------------------- //
        var topicIndex = this.props.topicIndex;
        var graphIndex = this.state.graphIndex;
        var stacked = this.options.stacked;
        var category = this.options["category"];
        var curve = this.options["curve"];
        var lineVariable = this.options["variable"][0];
        var barVariable = this.options["variable"][1];


        // --------------------------- Display --------------------------- //
        var display = ["none","none","none","none"]
        display[graphIndex] = "initial"


        // --------------------- Grouping & Normalize --------------------- //
        if(this.topicIndex!==topicIndex){

            // grouping
            this.groupingdata = require('../data/'+topicIndex.toString()+'_group.json');
            this.groups = [];
            this.menuCategoryItems = [];
            for(var key in this.groupingdata){
                if(key!=="_index"){
                    this.groups.push(key);
                    this.menuCategoryItems.push(
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                    );
                }
            }

            if(!this.groupingdata.hasOwnProperty(category)){
                category = "None";
                this.options.category = "None";
            }
            this.options.selectedKeys={}

            // normalize
            this.normalizedata = require('../data/'+topicIndex.toString()+'_normalizer.json');
            this.menuNormalizerItems = []
            for(key in this.normalizedata){
                this.menuNormalizerItems.push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }
        }

        // ---------------------------- Legend ---------------------------- //
        this.legend = [];
        this.displayLegend = "inline-table"
        this.colorcode = this.groupingdata[category];
        
        this.colors = [];

        if(this.topicIndex!=topicIndex){
            var ind = 0
            for(key in this.groupingdata["_index"]){
                this.options.selectedKeys[key] = true;
                ind+=1
                if(ind===10){break;}
            }
        }

        for(var item in this.colorcode){

            var color = this.colorcode[item]["color"];
            var ColorCheckbox = withStyles({
            root: {
                color: color,
                '&$checked': {
                color: color,
                },
            },
            checked: {},
            })(props => <Checkbox color="default" {...props} />);

            if(this.colorcode[item]["members"]===undefined){
                this.colors[
                    this.groupingdata["_index"][item]
                ] = color
                this.legend.push(
                    <Row key={item} style={{margin:"0", alignItems:"center"}}>
                        <ColorCheckbox
                            name={item}
                            checked={this.options.selectedKeys[item]}
                            onChange={this.checkBox}
                            value="checkedG"
                        />
                        <div style={{maxWidth:"80px",wordWrap: "break-word"}}>{item}</div>
                    </Row>
                )
            }else{

                var checkboxes = [];
                for(var member in this.colorcode[item]["members"]){
                    this.colors[
                        this.groupingdata["_index"][this.colorcode[item]["members"][member]]
                    ] = color
                    checkboxes.push(
                        <Row key={this.colorcode[item]["members"][member]} style={{margin:"0", alignItems:"center"}}>
                            <ColorCheckbox
                                name={this.colorcode[item]["members"][member]}
                                checked={this.options.selectedKeys[this.colorcode[item]["members"][member]]}
                                onChange={this.checkBox}
                                value="checkedG"
                            />
                            <div style={{width:"80px",wordWrap: "break-word"}}>
                                {this.colorcode[item]["members"][member]}
                            </div>
                        </Row>
                    )
                }
    
                this.legend.push(
                    <Row key={item} style={{margin:"0", alignItems:"center"}}>
                        {/* <div style={{
                            margin: "10px",
                            width: "10px", height:"10px", 
                            backgroundColor: color}}></div> */}
                        <div style={{wordWrap: "break-word",width:"100%"}}>{item}</div>
                        {checkboxes}
                    </Row>
                );
            }
        }
        

        // --------------------------- Timeline --------------------------- //
        if(graphIndex===0 || this.topicIndex!=topicIndex){
            this.timelineData = require('../data/'+topicIndex.toString()+'_timeline.json');
            this.timelineHeaders = [];
            this.menuVariableItems[0] = [];
            for(key in this.timelineData){
                this.timelineHeaders.push(key);
                this.menuVariableItems[0].push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }

            if(!this.timelineData.hasOwnProperty(lineVariable)){
                this.options["variable"][0] = this.timelineHeaders[0];
                lineVariable = this.timelineHeaders[0];
            }
            this.filteredtimelineData = [];
            this.fliteredColors = [];
            var normalizeOpt = this.options.normalize[0];

            for(var selectedIndexes in this.options.selectedKeys){

                // filter
                if(this.options.selectedKeys[selectedIndexes]){

                    var t_entry = this.timelineData[lineVariable]["data"][
                        this.groupingdata["_index"][selectedIndexes]];
                    var filteredEntry = {data:[],id:t_entry.id}

                    // normalize data
                    if(normalizeOpt !== ""){
                        for(key in t_entry["data"]){
                            var t_year = t_entry["data"][key]['x'].toString();
                            var t_value =  t_entry["data"][key]['y'];
                            filteredEntry["data"].push({
                                "x":t_year,
                                "y": t_value / this.normalizedata[normalizeOpt][t_entry.id][t_year]
                            });
                        }
                    }else{
                        filteredEntry = t_entry;
                    }
                    this.filteredtimelineData.push(filteredEntry);
                    this.fliteredColors.push(
                        this.colors[this.groupingdata["_index"][selectedIndexes]]
                    );
                }
            }
        }

        // --------------------------- BarGraph --------------------------- //
        if(graphIndex===1 || this.topicIndex!=topicIndex){
            this.bargraphData = require('../data/'+topicIndex.toString()+'_bar.json');
            this.bargraphHeaders = [];
            this.menuVariableItems[1] = [];
            for(key in this.bargraphData){
                this.bargraphHeaders.push(key);
                this.menuVariableItems[1].push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }
            if(!this.bargraphData.hasOwnProperty(barVariable)){
                this.options["variable"][1] = this.bargraphHeaders[0];
                barVariable = this.bargraphHeaders[0];
            }

            // copy keys
            this.chosenKeys = [];
            var ckey = this.bargraphData[barVariable]["keys"].length;
            while(ckey--) this.chosenKeys[ckey] = this.bargraphData[barVariable]["keys"][ckey];
            
            var asum = 0;

            for(var yearEntry in this.bargraphData[barVariable]["data"]){
                for(var entry in this.bargraphData[barVariable]["data"][yearEntry][1]){
                    asum=0;
                    for(key in this.chosenKeys){
                        asum+=this.bargraphData[barVariable]["data"][yearEntry][1][entry][this.chosenKeys[key]];
                    }

                    if(category==="None"){
                        this.bargraphData[barVariable]["data"][yearEntry][1][entry]["_byIndex"] = true;
                    }else{
                        var thiscolor = this.colors[
                            this.groupingdata._index[
                                this.bargraphData[barVariable]["data"][yearEntry][1][entry].id
                            ]
                        ];
                        this.bargraphData[barVariable]["data"][yearEntry][1][entry]["_color"] = thiscolor;
                        this.bargraphData[barVariable]["data"][yearEntry][1][entry]["_byIndex"] = false;
                    }

                    this.bargraphData[barVariable]["data"][yearEntry][1][entry]["_total"] = asum;
                }
            }
        }

        

        this.topicIndex=topicIndex;
        this.category=category;

        return (
            <div style={{
                flexGrow: 1,
                width: '100%'
            }}>

                <AppBar position="static">
                    <Tabs
                        TabIndicatorProps={{style: {backgroundColor: 'black'}}}
                        value={graphIndex}
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

                    {/* // --------------------------- Timeline --------------------------- // */}
                    <div style={{width:"80%", display:display[0]}}>
                        {<LineGraph
                                    data={this.filteredtimelineData} 
                                    stacked={stacked} 
                                    area={stacked}
                                    curve={curve}
                                    title={this.timelineData[lineVariable].title}
                                    colors={this.fliteredColors}/>}
                    </div>
                    {/* // --------------------------- BarGraph --------------------------- // */}
                    <div style={{width:"80%", display:display[1]}}>
                        {<Sample 
                                    title={this.bargraphData[barVariable]["title"]}
                                    pkeys={this.chosenKeys}
                                    dataGenerator={this.bargraphData[barVariable]["data"]} 
                                    groupMode={stacked}/>}
                    </div>
                    {/* // --------------------------- Options --------------------------- // */}
                    <div style={{height:"70vh", width:"20%", padding:'2%', overflowY: "scroll"}}>

                        {/* // --------------------------- Stacked --------------------------- // */}
                        <Row style={{display:graphOptions[graphIndex][0],paddingLeft:"10%", marginBottom: "5%"}}>
                            <Switch onColor="#222429" checked={stacked} 
                                    onChange={() => {this.changeInput("stacked")}} value={stacked} />
                            <div style={{marginLeft:"4%", fontFamily:"Verdana"}}>Stacked</div>
                        </Row>
                        <br />
                        {/* // --------------------------- Curve --------------------------- // */}
                        <div style={{display:graphOptions[graphIndex][2]}}>
                            <InputLabel shrink htmlFor="curve-label-placeholder">
                            Curve Type
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={curve}
                                onChange={this.changeInput}
                                input={<Input name="curve" id="curve-label-placeholder" />}
                                displayEmpty
                                name="curve"
                            >
                            <MenuItem value={'cardinal'}>Curved</MenuItem>
                            <MenuItem value={'linear'}>Linear</MenuItem>
                            </Select>
                        </div>
                        <br style={{display:graphOptions[graphIndex][2]}}/>
                        {/* // --------------------------- Variable --------------------------- // */}
                        <div>
                            <InputLabel shrink htmlFor="variable-label-placeholder">
                            Variable
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.options["variable"][graphIndex]}
                                onChange={this.changeInput}
                                input={<Input name="variable" id="variable-label-placeholder" />}
                                displayEmpty
                                name="variable"
                            >
                                {this.menuVariableItems[graphIndex]}
                            </Select>
                        </div>
                        <br />
                        {/* // --------------------------- Normalize --------------------------- // */}
                        <div>
                            <InputLabel shrink htmlFor="normalize-label-placeholder">
                            Normalize
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={this.options["normalize"][graphIndex]}
                                onChange={this.changeInput}
                                input={<Input name="normalize" id="normalize-label-placeholder" />}
                                displayEmpty
                                name="normalize"
                            >
                                <MenuItem value={''}>None</MenuItem>
                                {this.menuNormalizerItems}
                            </Select>
                        </div>
                        <br />
                        {/* // --------------------------- Categorize --------------------------- // */}
                        <div>
                            <InputLabel shrink htmlFor="categorize-label-placeholder">
                            Categorize
                            </InputLabel>
                            <Select
                                style={{width:"100%"}}
                                value={category}
                                onChange={this.changeInput}
                                input={<Input name="categorize" id="categorize-label-placeholder" />}
                                name="category"
                            >
                                {this.menuCategoryItems}
                            </Select>
                        </div>
                        <br />
                        {/* // --------------------------- Legend --------------------------- // */}
                        <div>
                            <div style={{
                                        display:this.displayLegend,
                                        width: "100%",
                                        minWidth: "100%",
                                        whiteSpace: "nowrap",
                                        borderRadius: "2px",
                                        fontFamily:"Georgia"
                                    }}>
                                {this.legend}
                            </div>
                        </div>
                    </div>
                </Row>
                <br />
            </div>
        );
    }
}