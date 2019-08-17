/*
    Notes:
    - Group and Category are the same thing

*/

import React, {Component} from 'react';
import { Row} from 'reactstrap';
import ScatterGraph from './ScatterGraph.js';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import $ from 'jquery';

const maxInitalKeys   = 40;

export default class ScatterFrame extends Component {

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
            this.options[event.target.name] = event.target.value;
            if(event.target.name==="normalizer"){
                this.selectedChanged = true;
            }
        }
        this.setState({});
    }
    // ====================================================================== //

    set(data){
        this.data = data.topics;
        this.setState({});
    }



    
    render(){
        if((this.topicIndex !== topicIndex) && this.done===false){
            $.ajax({
                url: "http://54.219.61.146:5000/new/get/"+this.props.topicIndex,
                context: document.body,
                crossDomain: true
            }).done(this.set);
            this.done = true;
        }

        if(this.data!==undefined){

            // ============================ General ========================== //
            var i = 0;      // array index
            var ct = 0;     // counter
            var key = "";   // object key

            // ============================= Init ============================= //
            var topicIndex      = this.props.topicIndex;
            var stacked         = this.options["stacked"];
            var category        = this.options["category"];
            var curve           = this.options["curve"];
            var variable        = this.options["variable"];
            var normalizer      = this.options["normalizer"];

            // =========================== Reload Topic =========================== //
            if((this.topicIndex !== topicIndex) && this.done){
                this.done = false;

                // update data to new topic's
                this.topicIndex = topicIndex;
                
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
            if(this.variable !== variable || this.topicIndex !== topicIndex){

                // var groupingdata        = this.data[variable]["group"];
                var groupingdata        = "Linear";
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
                if(groupingdata==="Linear"){
                    var vItems = Object.keys(this.data[variable]);
                    var startColor  = [ Math.floor(Math.random() * 256),
                                        Math.floor(Math.random() * 256),
                                        Math.floor(Math.random() * 256)]; 
                    var endColor    = [ Math.floor(Math.random() * 256),
                                        Math.floor(Math.random() * 256),
                                        Math.floor(Math.random() * 256)];
                    var colorStep   = [ (endColor[0]-startColor[0])/vItems.length,
                                        (endColor[1]-startColor[1])/vItems.length,
                                        (endColor[2]-startColor[2])/vItems.length]

                    this.groups["None"] = {};
                    for(i in vItems){
                        this.groups["None"][vItems[i]] = {"color":
                            "rgb("+
                            (startColor[0]+(colorStep[0]*i)).toString() + "," +
                            (startColor[1]+(colorStep[1]*i)).toString() + "," +
                            (startColor[2]+(colorStep[2]*i)).toString() +
                            ")"
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
                for(key in this.data[variable]){
                    this.options["selectedKeys"][key] = ((ct++ % maxInitalKeys === 0) && ct!==1);
                }


            }

            

            // =========================== Reload Category =========================== //
            if(this.selectedChanged || this.category !== category || 
                this.variable !== variable || this.topicIndex !== topicIndex){
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
                var temp_years_index    = Object.keys(this.data[variable][Object.keys(this.data[variable])[0]]);
                var years_index         = {};
                for(i in temp_years_index){
                    years_index[temp_years_index[i]] = i;
                }

                // filter
                for(key in this.options.selectedKeys){
                    if(this.options.selectedKeys[key]){
                        var t_entry = this.data[variable][key];
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

            this.topicIndex         = topicIndex;
            this.variable           = variable;
            this.category           = category;
            this.selectedChanged    = false;
            console.log(this.filteredData);

            return (
                    <div>
                        <Row style={{width:"100%", margin:"0", padding:"0"}}>

                            {/* // =========================== Graph =========================== // */}
                            <div style={{height:"600px", width:"77%"}}>
                                {<ScatterGraph
                                        titleX={variableX}
                                        titleY={variableY}
                                        dataGenerator={this.filteredData}
                                        colors={this.filteredColors}
                                    />}
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