/*
    Notes:
    - Group and Category are the same thing
    - normalizer refers to Y
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
import countries from '../data/map.json';
import linear_colors from '../data/Numerical.json';
import $ from 'jquery';

const maxInitalKeys   = 10;
const categoryTypes   = ["Numerical","Country","States","Other"];
const countryGroups   = ["None","Region","Continent"]

export default class ScatterFrame extends Component {

    constructor(props){
        super(props);
        this.options = {
            category        : "None",
            // variable        : categoryTypes[0],
            variableX       : "",
            variableY       : "",
            normalizerX     : "",
            normalizer      : "",
            selectedKeys    : {}
        }

        this.data               = {};
        this.topicIndex         = -1;
        // this.variable           = categoryTypes[0];
        this.variableX          = "";
        this.variableY          = "";
        this.category           = "None";
        this.variableItemsX    = [];
        this.variableItemsY    = [];
        this.categoryItems      = [];
        this.normalizerItems    = [];
        this.keysXY             = [];
        this.yearsXY            = [];

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

        // this.variableItems = [];
        // for(var i in categoryTypes){
        //     var key = categoryTypes[i];
        //     this.variableItemsXY.push(
        //         <MenuItem key={key} value={key}>{key}</MenuItem>
        //     );
        // }
    }


    // ============================ Input Handlers ========================== //
    checkBox(event, checked){
        this.options.selectedKeys[event.target.name] = checked;
        this.selectedChanged = true;
        this.setState({});
    }

    changeInput(event){
        this.options[event.target.name] = event.target.value;
        if(event.target.name==="normalizer"||event.target.name==="normalizerX") this.selectedChanged = true;
        this.setState({});
    }
    // ====================================================================== //

    set(data){
        this.data = data.topics;
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
            this.set(require("../data/"+this.props.topicIndex+".json"));
        }

        if(this.data!==undefined){


            // ============================ General ========================== //
            var i = 0;      // array index
            var ct = 0;     // counter
            var key = "";   // object key

            // ============================= Init ============================= //
            var topicIndex      = this.props.topicIndex;
            var category        = this.options["category"];
            // var variable        = this.options["variable"];
            var variableX       = this.options["variableX"];
            var variableY       = this.options["variableY"];
            var normalizerX     = this.options["normalizerX"];
            var normalizer      = this.options["normalizer"];
            var displayCategory = "initial"

            // =========================== Reload Topic =========================== //
            if(this.done){
            //     // ------------------- Variable Menu ------------------- //
            //     this.options["variable"] = categoryTypes[0];
            // }


            // // =========================== Reload Variable =========================== //
            // if(this.variable !== variable || this.done){

                // if(variable === "Numerical"){
                //     displayCategory = "none";
                // }

                // ------------------- VariableXY Menu ------------------- //
                this.variableItemsXY = [];
                var headers = [];
                for(i in this.data){
                    key = this.data[i];
                    headers.push(key);
                    this.variableItemsX.push(
                        <MenuItem key={key} value={key}>{key}</MenuItem>
                    );
                }

                variableX  = headers[0];
                variableY  = headers[0];
                if(headers.length > 1) variableY  = headers[1];
                this.options["variableX"] = variableX;
                this.options["variableY"] = variableY;

                var groupingdata        = this.data[variableX].type;
                var normalizerdata      = this.data;

                this.options["normalizerX"] = "";
                this.options["category"]    = "None";
                this.options["normalizer"]  = "";
                category                    = "None";
                normalizerX                 = "";
                normalizer                  = "";

                // // ------------------- Group Menu ------------------- //
                // this.categoryItems = [];
                // for(key in groupingdata){
                //     this.categoryItems.push(
                //         <MenuItem key={key} value={key}>{key}</MenuItem>
                //     );
                // }

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
                for(key in this.data[variableX]){
                    this.options["selectedKeys"][key] = (ct++ < maxInitalKeys);
                }

            }

            if(this.variableX!==variableX || this.variableY!==variableY){
                this.options["category"]    = "None";
                this.groups = {};
                if(variable==="Numerical"){

                    this.groups["None"] = {};
                    var vItems = Object.keys(this.data[variable]);

                    for(i in vItems){
                        this.groups["None"][vItems[i]] = {
                            "color": linear_colors["jet"][Math.floor(i/vItems.length)]
                        };
                    }
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
            if(this.selectedChanged || this.variableX !== variableX || this.variableY !== variableY){ 
                this.filteredData   = [];
                this.filteredColors = [];
                var temp_years_index    = Object.keys(this.data[variableX][Object.keys(this.data[variableX])[0]]);
                var years_index         = {};
                for(i in temp_years_index){
                    years_index[temp_years_index[i]] = i;
                }

                for(key in years_index){
                    this.filteredData[years_index[key]] = [key,[]]; 
                }

                // filter
                for(key in this.options.selectedKeys){
                    if(this.options.selectedKeys[key]){

                        // normalize data
                        for(var t_year in years_index){

                            var normalizedEntry = {data:[],id:key};
                            var t_index         = years_index[t_year];
                            var t_normalizedX   = this.data[variableX][t_year];
                            var t_normalized    = this.data[variableY][t_year];

                            if(normalizerX !== ""){
                                var t_normalizerX = this.data[variable]["normalizer"][normalizerX][key][t_year];
                                if(t_normalizerX!==undefined){
                                    t_normalizedX/=t_normalizerX;
                                }else{
                                    t_normalizedX = null;
                                }

                            }
                            if(normalizer !== ""){
                                var t_normalize   = this.data[variable]["normalizer"][normalizer][key][t_year];
                                if(t_normalize!==undefined){
                                    t_normalized/=t_normalize;
                                }else{
                                    t_normalize = null;
                                }
                            }

                            normalizedEntry["data"].push( {
                                "x": t_normalizedX,
                                "y": t_normalized
                            });
                            this.filteredData[t_index][1].push(normalizedEntry);
                        }

                        this.filteredColors.push(this.colors[key]);
                    }
                }
            }
            console.log(this.filteredData);

            this.topicIndex         = topicIndex;
            this.variable           = variable;
            this.variableX          = variableX;
            this.variableY          = variableY;
            this.category           = category;
            this.selectedChanged    = false;

            return (
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

                            {/* // --------------------------- Variable --------------------------- // */}
                            <div>
                                <InputLabel shrink htmlFor="variable-label-placeholder">
                                Plot
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
                            <br/>

                            {/* // --------------------------- VariableX --------------------------- // */}
                            <div>
                                <InputLabel shrink htmlFor="variableX-label-placeholder">
                                X Values
                                </InputLabel>
                                <Select
                                    style       = {{width:"100%"}}
                                    value       = {variableX}
                                    onChange    = {this.changeInput}
                                    input       = {<Input name="variableX" id="variableX-label-placeholder" />}
                                    name        = "variableX"
                                    displayEmpty
                                >
                                    {this.variableItemsXY}
                                </Select>
                            </div>
                            <br />

                            {/* // --------------------------- NormalizeX --------------------------- // */}
                            <div>
                                <InputLabel shrink htmlFor="normalizeX-label-placeholder">
                                X Normalizer
                                </InputLabel>
                                <Select
                                    style       = {{width:"100%"}}
                                    value       = {normalizerX}
                                    onChange    = {this.changeInput}
                                    input       = {<Input name="normalizerX" id="normalizeX-label-placeholder" />}
                                    name        = "normalizerX"
                                    displayEmpty
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    {this.normalizerItems}
                                </Select>
                            </div>
                            <br />

                            {/* // --------------------------- VariableY --------------------------- // */}
                            <div>
                                <InputLabel shrink htmlFor="variableY-label-placeholder">
                                Y Values
                                </InputLabel>
                                <Select
                                    style       = {{width:"100%"}}
                                    value       = {variableY}
                                    onChange    = {this.changeInput}
                                    input       = {<Input name="variableY" id="variableY-label-placeholder" />}
                                    name        = "variableY"
                                    displayEmpty
                                >
                                    {this.variableItemsXY}
                                </Select>
                            </div>
                            <br />

                            {/* // --------------------------- NormalizeY --------------------------- // */}
                            <div>
                                <InputLabel shrink htmlFor="normalize-label-placeholder">
                                Y Normalizer
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
                                    style       = {{width:"100%",display:displayCategory}}
                                    value       = {category}
                                    onChange    = {this.changeInput}
                                    input       = {<Input name="categorize" id="categorize-label-placeholder" />}
                                    name        = "category"
                                    displayEmpty
                                >
                                    {this.categoryItems}
                                </Select>
                            </div>
                            <br style={{display:displayCategory}}/>

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
        return null;
    }
}