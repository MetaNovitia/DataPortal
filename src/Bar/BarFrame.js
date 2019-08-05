/*
    Notes:
    - Group and Category are the same thing

*/

import React, {Component} from 'react';
import { Row} from 'reactstrap';
import BarGraph from './RaceBar.js';
import Switch from "react-switch";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const maxInitalKeys   = 10;

export default class BarFrame extends Component {

    constructor(props){
        super(props);
        this.options = {
            category        : "None",
            variable        : "",
            normalizer      : "",
            stacked         : true,
            selectedKeys    : {},
            selectedItems   : []
        }

        this.data               = {};
        this.topicIndex         = -1;
        this.variable           = "";
        this.category           = "None";
        this.variableItems      = [];
        this.categoryItems      = [];
        this.normalizerItems    = [];

        this.legend             = [];
        this.colors             = {};
        this.filteredData       = [];
        this.filteredColors     = [];
        this.selectedChanged    = false;
        this.normalizedData     = {};

        this.changeInput        = this.changeInput.bind(this);
        this.checkBox           = this.checkBox.bind(this);
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


    
    render(){

        // ============================ General ========================== //
        // var i = 0;      // array index
        var ct = 0;     // counter
        var key = "";   // object key

        // ============================= Init ============================= //
        var topicIndex      = this.props.topicIndex;
        var stacked         = this.options["stacked"];
        var category        = this.options["category"];
        var variable        = this.options["variable"];
        var normalizer      = this.options["normalizer"];

        // =========================== Reload Topic =========================== //
        if(this.topicIndex !== topicIndex){

            // update data to new topic's
            this.topicIndex = topicIndex;
            this.data = require('../data/' + topicIndex.toString() + '_Bar.json'); // AJAX CALL HERE

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

            var groupingdata        = this.data[variable]["group"];
            var normalizerdata      = this.data[variable]["normalizer"];

            this.options["category"]    = "None";
            this.options["normalizer"]  = "";
            category                    = "None";
            normalizer                  = "";

            // ------------------- Group Menu ------------------- //
            this.categoryItems = [];
            for(key in groupingdata){
                this.categoryItems.push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
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
            for(key in this.data[variable]["data"]){
                this.options["selectedKeys"][key] = (ct++ < maxInitalKeys);
            }

             // ------------------ Selected Items ------------------ //
            this.options.selectedItems = [];
            for(key in this.data[variable]["items"]){
                this.options.selectedItems.push(this.data[variable]["items"][key]);
            }

        }

        

        // =========================== Reload Category =========================== //
        if(this.selectedChanged || this.category !== category || 
            this.variable !== variable || this.topicIndex !== topicIndex){
            // --------------------- Legend --------------------- //
            this.legend     = [];
            this.colors     = {};
            var colorcode   = this.data[variable]["group"][category];

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
            this.filteredColors = [];
            this.filteredData   = [];
            var years_index = this.data[variable]["years"];

            for(key in years_index){
                this.filteredData[years_index[key]] = [key,[]]; 
            }

            // filter
            for(key in this.options.selectedKeys){
                if(this.options.selectedKeys[key]){
                    var t_entry = this.data[variable]["data"][key];

                    // normalize data
                    for(var t_year in t_entry){

                        var normalizedEntry = {
                            "id" : key
                        };

                        var t_index         = years_index[t_year];
                        var t_sum           = 0;
                        var t_normalizer    = 1;
                        if(normalizer !== ""){
                            t_normalizer = this.data[variable]["normalizer"][normalizer][key][t_year];
                        }
                        
                        for(var item in t_entry[t_year]){
                            normalizedEntry[item] = t_entry[t_year][item] / t_normalizer;
                            t_sum += normalizedEntry[item];
                        }
                        
                        normalizedEntry["_total"]   = t_sum;
                        normalizedEntry["_byIndex"] = (category) === "None";
                        normalizedEntry["_color"]   = this.colors[key];

                        this.filteredData[t_index][1].push(normalizedEntry);

                    }
                }
            }
        }

        this.topicIndex         = topicIndex;
        this.variable           = variable;
        this.category           = category;
        this.selectedChanged    = false;

        return (
                <Row style={{height:"600px",width:"100%", margin:"0", padding:"0"}}>

                    {/* // =========================== Graph =========================== // */}
                    <div style={{width:"80%"}}>
                        {<BarGraph
                                data        = {this.filteredData} 
                                groupMode   = {stacked}
                                title       = {this.data[variable].title}
                                pkeys       = {this.options.selectedItems}
                            />}
                    </div>
            
                    {/* // =========================== Options =========================== // */}
                    <div style={{width:"20%", padding:'2%', overflowY: "scroll"}}>

                        {/* // --------------------------- Stacked --------------------------- // */}
                        <Row style={{display:'flex',paddingLeft:"10%", marginBottom: "5%"}}>
                            <Switch onColor     = "#222429" 
                                    checked     = {stacked}
                                    onChange    = {() => {this.changeInput("stacked")}} 
                                    value       = {stacked} />
                            <div style={{marginLeft:"4%", fontFamily:"Verdana"}}>Stacked</div>
                        </Row>
                        <br />

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
        );
    }
}