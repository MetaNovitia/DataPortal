/*
    Notes:
    - Group and Category are the same thing

*/

import React, {Component} from 'react';
import { Row} from 'reactstrap';
import LineGraph from './LineGraph.js'
import Switch from "react-switch";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import linear_colors from '../../../data/Numerical.json';
import $ from 'jquery';

const maxInitalKeys   = 40;

export default class LineFrame extends Component {

    constructor(props){
        super(props);
        this.options = {
            category        : "None",
            variable        : "",
            curve           : "cardinal",
            normalizer      : "",
            stacked         : true,
            selectedKeys    : {}
        }

        this.data               = undefined;
        this.topicIndex         = -1;
        this.variable           = "";
        this.type               = "";
        this.category           = "None";
        this.variableItems      = [];
        this.categoryItems      = [];
        this.normalizerItems    = [];

        this.legend             = [];
        this.colors             = {};
        this.groups             = {};
        this.filteredData       = [];
        this.filteredColors     = [];
        this.selectedChanged    = false;
        this.normalizedData     = {};

        this.changeInput        = this.changeInput.bind(this);
        this.checkBox           = this.checkBox.bind(this);
        this.set                = this.set.bind(this);
        this.done               = false;
    }


    // ============================ Input Handlers ========================== //
    checkBox(event, checked){
        this.options.selectedKeys[event.target.name] = checked;
        this.selectedChanged = true;
        this.setState({});
    }

    changeInput(event){
        if(event==="stacked"){
            this.options.stacked = !this.options.stacked;
        }else{
            if( event.target.name==="normalizer" && 
                this.options[event.target.name] !== event.target.value){
                this.selectedChanged = true;
            }
            this.options[event.target.name] = event.target.value;
        }
        this.setState({});
    }
    // ====================================================================== //

    set(data){
        this.data = data;
        this.done = true;

        // update data to new topic's
        this.topicIndex = this.props.topicIndex;

        this.setState({});
    }



    
    render(){
        if(this.topicIndex !== this.props.topicIndex){
            // $.ajax({
            //     url: "http://54.219.61.146:5000/new/get/"+this.props.topicIndex,
            //     context: document.body,
            //     crossDomain: true
            // }).done(this.set);
            this.set(require(
                "../../../data/new/get/" + this.props.topicIndex+
                "/" + this.props.type +
                "/"+ this.props.variable +
                ".json"));
        }

        if(this.data!==undefined){

            // ============================ General ========================== //
            var i = 0;      // array index
            var ct = 0;     // counter
            var key = "";   // object key

            // ============================= Init ============================= //
            var stacked         = this.options["stacked"];
            var category        = this.options["category"];
            var curve           = this.options["curve"];
            var variable        = this.options["variable"];
            var normalizer      = this.options["normalizer"];

            // =========================== Reload Topic =========================== //
            if(this.done){
                
                // Variable Menu
                this.variableItems = [];
                for(key in this.data){
                    this.variableItems.push(
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                    );
                }
                
                // initialize choices
                variable =  Object.keys(this.data)[0];
                this.options["variable"] = variable;
            }

            // =========================== Reload Variable =========================== //
            if(this.variable !== variable || this.done){

                var groupingdata        = this.props.type;
                var normalizerdata      = this.data;

                this.options["category"]    = "None";
                this.options["normalizer"]  = "";
                category                    = "None";
                normalizer                  = "";

                /*
                // ------------------- Group Menu ------------------- //
                this.categoryItems = [];
                for(key in groupingdata){
                    this.categoryItems.push(
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                    );
                }*/
                this.groups = {};
                if(groupingdata==="Numerical"){
                    var vItems = Object.keys(this.data[variable].data);

                    this.groups["None"] = {};
                    for(i in vItems){
                        this.groups["None"][vItems[i]] = {
                            "color": linear_colors["cool"][Math.floor(i/vItems.length*1000)]
                        };
                    }
                }

                // ----------------- Normalizer Menu ----------------- //
                // Normalize Menu
                this.normalizerItems = [];
                for(key in normalizerdata){
                    this.normalizerItems.push(
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                    );
                }

                // ------------------ Selected Keys ------------------ //
                this.selectedChanged = true;
                this.options["selectedKeys"] = {};
                ct = 0;
                for(key in this.data[variable].data){
                    this.options["selectedKeys"][key] = ((ct++ % maxInitalKeys === 0) && ct!==1);
                }


            }

            

            // =========================== Reload Category =========================== //
            if(this.selectedChanged || this.category !== category || 
                this.variable !== variable || this.done){
                // --------------------- Legend --------------------- //
                this.legend     = [];
                this.colors     = {};
                var colorcode   = this.groups[category];

                for(key in colorcode){
                    var color = colorcode[key]["color"];
                    var ColorCheckbox = withStyles({
                            root: {
                                color: color
                            }
                        })(props => <Checkbox color="default" {...props} />);

                    // No Grouping
                    if(colorcode[key]["members"]===undefined){
                        this.colors[key] = color;
                        this.legend.push(
                            <Row key={key} style={{margin:"0", alignItems:"center"}}>
                                <ColorCheckbox
                                    name={key}
                                    checked={this.options.selectedKeys[key]}
                                    onChange={this.checkBox}
                                    value="checkedG"
                                />
                                <div style={{maxWidth:"80px",wordWrap: "break-word"}}>{key}</div>
                            </Row>
                        )
                    }
                    // Has Grouping
                    else{
                        // Add all members of the group
                        var checkboxes = [];
                        for(var member in colorcode[key]["members"]){
                            this.colors[colorcode[key]["members"][member]] = color;
                            checkboxes.push(
                                <Row key={colorcode[key]["members"][member]} style={{margin:"0", alignItems:"center"}}>
                                    <ColorCheckbox
                                        name={colorcode[key]["members"][member]}
                                        checked={this.options.selectedKeys[colorcode[key]["members"][member]]}
                                        onChange={this.checkBox}
                                        value="checkedG"
                                    />
                                    <div style={{width:"80px",wordWrap: "break-word"}}>
                                        {colorcode[key]["members"][member]}
                                    </div>
                                </Row>
                            )
                        }
            
                        this.legend.push(
                            <Row key={key} style={{margin:"0", alignItems:"center"}}>
                                <div style={{wordWrap: "break-word",width:"100%"}}>{key}</div>
                                {checkboxes}
                            </Row>
                        );
                    }
                }
                this.selectedChanged = true;
            }

            // =========================== Reload Selected =========================== //
            if(this.selectedChanged){ 
                this.filteredData       = [];
                this.filteredColors     = [];
                var temp_years_index    =   Object.keys(this.data[variable].data[
                                                Object.keys(this.data[variable].data)[0]
                                            ]);
                var years_index         = {};
                for(i in temp_years_index){
                    years_index[temp_years_index[i]] = i;
                }

                // filter
                for(key in this.options.selectedKeys){
                    if(this.options.selectedKeys[key]){
                        var t_entry = this.data[variable].data[key];
                        var normalizedEntry = {data:[],id:key};

                        // normalize data
                        for(var t_year in t_entry){

                            var t_value         = t_entry[t_year];
                            var t_index         = years_index[t_year];
                            if(normalizer !== ""){
                                var t_normalizer    = this.data[normalizer][key][t_year];
                                if(t_normalizer!==undefined){
                                    normalizedEntry["data"][t_index] = {
                                        "x": t_year,
                                        "y": t_value / t_normalizer
                                    };
                                }else{
                                    normalizedEntry["data"][t_index] = {
                                        "x": t_year,
                                        "y": null
                                    };
                                }
                            }else{
                                normalizedEntry["data"][t_index] = {
                                    "x": t_year,
                                    "y": t_value
                                };
                            }


                        }

                        this.filteredData.push(normalizedEntry);
                        this.filteredColors.push(this.colors[key]);
                    }
                }
            }

            this.variable           = variable;
            this.category           = category;
            this.selectedChanged    = false;
            this.done               = false;

            return (
                    <div>
                        <Row style={{width:"100%", margin:"0", padding:"0"}}>

                            {/* // =========================== Graph =========================== // */}
                            <div style={{height:"600px", width:"77%"}}>
                                {<LineGraph
                                            data    = {this.filteredData} 
                                            stacked = {stacked} 
                                            area    = {stacked}
                                            curve   = {curve}
                                            title   = {this.data[variable].data.title}
                                            colors  = {this.filteredColors}/>}
                            </div>
                    
                            {/* // =========================== Options =========================== // */}
                            <div style={{height:"600px", width:"23%", padding:'2%', overflowY: "scroll"}}>

                                {/* // --------------------------- Stacked --------------------------- // */}
                                <Row style={{display:'flex',paddingLeft:"10%", marginBottom: "5%"}}>
                                    <Switch onColor     = "#222429" 
                                            onChange    = {() => {this.changeInput("stacked")}} 
                                            checked     = {stacked}
                                            value       = {stacked} />
                                    <div style={{marginLeft:"4%", fontFamily:"Verdana"}}>Stacked</div>
                                </Row>
                                <br />

                                {/* // --------------------------- Curve --------------------------- // */}
                                <div>
                                    <InputLabel shrink htmlFor="curve-label-placeholder">
                                    Curve Type
                                    </InputLabel>
                                    <Select
                                        style       = {{width:"100%"}}
                                        value       = {curve}
                                        onChange    = {this.changeInput}
                                        input       = {<Input name="curve" id="curve-label-placeholder" />}
                                        name        = "curve"
                                        displayEmpty
                                    >
                                        <MenuItem value={'cardinal'}>Curved</MenuItem>
                                        <MenuItem value={'linear'}  >Linear</MenuItem>
                                    </Select>
                                </div>
                                <br/>

                                {/* // --------------------------- Variable --------------------------- // */}
                                <div>
                                    <InputLabel shrink htmlFor="variable-label-placeholder">
                                    Variable
                                    </InputLabel>
                                    <Select
                                        style       = {{width:"100%"}}
                                        value       = {variable}
                                        onChange    = {this.changeInput}
                                        input       = {<Input name="variable" id="variable-label-placeholder" />}
                                        name        = "variable"
                                        displayEmpty
                                    >
                                        {this.variableItems}
                                    </Select>
                                </div>
                                <br />

                                {/* // --------------------------- Normalize --------------------------- // */}
                                <div>
                                    <InputLabel shrink htmlFor="normalize-label-placeholder">
                                    Normalize
                                    </InputLabel>
                                    <Select
                                        style       = {{width:"100%"}}
                                        value       = {normalizer}
                                        onChange    = {this.changeInput}
                                        input       = {<Input name="normalizer" id="normalize-label-placeholder" />}
                                        name        = "normalizer"
                                        displayEmpty
                                    >
                                        <MenuItem value={''}>None</MenuItem>
                                        {this.normalizerItems}
                                    </Select>
                                </div>
                                <br />

                                {/* // --------------------------- Categorize --------------------------- // */}
                                <div>
                                    <InputLabel shrink htmlFor="categorize-label-placeholder">
                                    Categorize
                                    </InputLabel>
                                    <Select
                                        style       = {{width:"100%"}}
                                        value       = {category}
                                        onChange    = {this.changeInput}
                                        input       = {<Input name="categorize" id="categorize-label-placeholder" />}
                                        name        = "category"
                                        displayEmpty
                                    >
                                        {this.categoryItems}
                                    </Select>
                                </div>
                                <br />

                                {/* // --------------------------- Legend --------------------------- // */}
                                <div>
                                    <div style={{
                                                display         : "inline-table",
                                                width           : "100%",
                                                minWidth        : "100%",
                                                whiteSpace      : "nowrap",
                                                borderRadius    : "2px",
                                                fontFamily      : "Georgia"
                                            }}>
                                        {this.legend}
                                    </div>
                                </div>
                            </div>
                    </Row>
                </div>
            );
        }
        return null;
    }
}