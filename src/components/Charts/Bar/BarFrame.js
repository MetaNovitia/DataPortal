/*
    Notes:
    - Group and Category are the same thing

*/

import React, {Component} from 'react';
import { Row} from 'reactstrap';
import BarGraph from './RaceBar.js'
import Switch from "react-switch";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import linear_colors from '../../../data/Numerical.json';
import $ from 'jquery';

const maxInitalKeys   = 1;

export default class BarFrame extends Component {

    constructor(props){
        super(props);
        this.options = {
            category        : "_items",
            stacked         : true,
            selectedKeys    : {},
            ranking         : "top",
            numberOfItems   : 10
        }

        this.data               = {};
        this.topicIndex         = -1;
        this.type               = "";
        this.category           = "_items";
        this.categoryItems      = [];

        this.legend             = [];
        this.colors             = {};
        this.groups             = {};
        this.filteredData       = [];
        this.filteredColors     = [];
        this.selectedChanged    = false;
        // this.normalizedData     = {};

        this.changeInput        = this.changeInput.bind(this);
        this.checkBox           = this.checkBox.bind(this);
        this.set                = this.set.bind(this);
        this.setNormalizer      = this.setNormalizer.bind(this);
        this.done1              = false;
        this.done2              = false;
        this.normchanged        = false;
        this.varchanged         = false;
        this.changedMul         = undefined;
        this.storage            = this.props.storage;

        this.numChoices = [];
        for(var i=5; i<=30; i+=5){
            this.numChoices.push(<MenuItem key={i} value={i}>{i}</MenuItem>)
        }
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

    setNormalizer(data){
        this.normalizerdata = data;
        this.done2 = true;

        this.normalizer     = this.props.normalizer;
        this.normchanged    = true;

        this.setState({});
    }

    set(data,i){
         
        this.data[this.props.mul[i]] = data;
        this.done1[i] = true;

        this.variable       = this.props.variable;
        this.varchanged     = true;

        this.setState({});
    }

    
    render(){


        // ============================ General ========================== //
        var i = 0;      // array index
        var ct = 0;     // counter
        var key = "";   // object key

        if(this.changedMul !== this.props.changedMul){
            this.changedMul = this.props.changedMul;
            this.done1 = [];
            this.data = {};
            // $.ajax({
            //     url: "https://54.219.61.146:5000/new/get/"+this.props.topicIndex,
            //     context: document.body,
            //     crossDomain: true
            // }).done(this.set);
            for(i in this.props.mul){
                if(!this.storage.hasOwnProperty(this.props.mul[i])){
                    this.done1.push(false);
                    console.log("One");
                    var nData = require(
                        "../../../data/new/get/" + this.props.topicIndex+
                        "/" + this.props.type +
                        "/"+ this.props.mul[i] +
                        ".json")
                    this.storage[this.props.mul[i]] = nData;
                    this.set(nData,i);
                }else this.set(this.storage[this.props.mul[i]],i);
            }
        }
        
        if(this.normalizer !== this.props.normalizer){
            if(!this.storage.hasOwnProperty(this.props.normalizer)){
                this.done2 = false;
                if(this.props.normalizer!=="None"){
                    // $.ajax({
                    //     url: "https://54.219.61.146:5000/new/get/"+this.props.topicIndex,
                    //     context: document.body,
                    //     crossDomain: true
                    // }).done(this.set);
                    var nData = require(
                        "../../../data/new/get/" + this.props.topicIndex+
                        "/" + this.props.type +
                        "/"+ this.props.normalizer +
                        ".json");
                    this.storage[this.props.normalizer] = nData;
                    this.setNormalizer(nData);
                }else{
                    this.setNormalizer("None");
                }
            }else this.setNormalizer(this.storage[this.props.normalizer]);
        }

        // check if all variables are read
        this.done = true;
        for(i=0; i<this.props.mul.length; i++){
            if(this.done1[i]!==true){
                this.done=false;
                break;
            }
        }

        if(this.done && this.done2 && Object.keys(this.data).length!==0){

            // ============================= Init ============================= //
            var stacked         = this.options["stacked"];
            var category        = this.options["category"];
            var type            = this.props.type;
            var colorType       = this.props.colorType;
            var firstVar        = Object.keys(this.data)[0];
            var numberOfItems   = this.options["numberOfItems"];
            var ranking         = this.options["ranking"];

            /*
            // ------------------- Group Menu ------------------- //
            this.categoryItems = [];
            for(key in groupingdata){
                this.categoryItems.push(
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                );
            }*/

            // =========================== Reload Type =========================== //
            if(this.type !== type){

                // ------------------ Selected Keys ------------------ //
                this.options["selectedKeys"] = {};
                ct = 0;
                for(key in this.data[firstVar]){
                    this.options["selectedKeys"][key] = 
                        true;
                        //((ct++ % maxInitalKeys === 0) && ct!==1);
                }

                this.options["category"] = "_items";
                category = this.options["category"];
            }

            if(this.type !== type || this.color!=this.props.color){
                this.groups = {};
                if(colorType === "Numerical"){
                    var vItems = Object.keys(this.data[firstVar]);

                    this.groups["None"] = {};
                    for(i in vItems){
                        this.groups["None"][vItems[i]] = {
                            "color": linear_colors[this.props.color][Math.floor(i/vItems.length*1000)]
                        };
                    }
                }
            }

            // =========================== Reload Category =========================== //
            if(this.category !== category || this.type!== type || this.selectedChanged || this.color!=this.props.color){
                // --------------------- Legend --------------------- //
                this.legend     = [];
                this.colors     = {};
                var colorcode   = this.groups[category];
                if(category==="_items") colorcode = this.groups["None"];

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
            if(this.selectedChanged || this.normchanged || this.varchanged){ 
                this.filteredColors = [];
                this.filteredData   = [];
                var firstItem = Object.keys(this.data[firstVar])[0];
                var temp_years_index = Object.keys(this.data[firstVar][firstItem]);
                var years_index = {};

                for(key in temp_years_index){
                    years_index[temp_years_index[key]] = key;
                    this.filteredData[key] = [temp_years_index[key],[]]; 
                }

                // filter
                for(key in this.options.selectedKeys){
                    if(this.options.selectedKeys[key]){

                        // normalize data
                        for(var t_year in years_index){

                            var normalizedEntry = {
                                "id" : key
                            };

                            var t_index         = years_index[t_year];
                            var t_sum           = 0;
                            var t_normalizer    = 1;
                            if(this.normalizer !== "None") t_normalizer = this.normalizerdata[key][t_year];
                            
                            for(var item in this.data){
                                var n_entry = this.data[item][key][t_year] / t_normalizer;
                                if(!Number.isNaN(n_entry)){
                                    normalizedEntry[item] = n_entry;
                                    t_sum += normalizedEntry[item];
                                }else{
                                    normalizedEntry[item] = 0;
                                }
                            }
                            
                            normalizedEntry["_total"]   = t_sum;
                            normalizedEntry["_byIndex"] = (category) === "None";
                            normalizedEntry["_color"]   = this.colors[key];

                            this.filteredData[t_index][1].push(normalizedEntry);

                        }
                    }
                }
            }

            this.category           = category;
            this.selectedChanged    = false;
            this.normchanged        = false;
            this.varchanged         = false;
            this.type               = type;
            var title               = "(";
            for(i in this.props.mul){
                console.log(i);
                if(i!=="0" && i!==0) title += " + ";
                title += this.props.mul[i];
            }
            title += ")";
            if(this.normalizer!=="None") title += " / " + this.normalizer;

            return (
                    <div>
                        <Row style={{width:"100%", margin:"0", padding:"0"}}>

                            {/* // =========================== Graph =========================== // */}
                            <div style={{height:"600px", width:"77%"}}>
                                {<BarGraph
                                    data            = {this.filteredData} 
                                    groupMode       = {stacked}
                                    title           = {title}
                                    pkeys           = {this.props.mul}
                                    numberOfItems   = {numberOfItems}
                                    ranking         = {ranking}
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
                                        <MenuItem value={"None"}>By Variable</MenuItem>
                                        <MenuItem value={"_items"}>By Item</MenuItem>
                                        {this.categoryItems}
                                    </Select>
                                </div>
                                <br />

                                {/* // --------------------------- Top/Bottom --------------------------- // */}
                                <div style={{width:"100%"}}>
                                    <InputLabel shrink htmlFor="ranking-label-placeholder">
                                    Ranking
                                    </InputLabel>
                                    <Select
                                        style       = {{width:"60%"}}
                                        value       = {ranking}
                                        onChange    = {this.changeInput}
                                        input       = {<Input name="ranking" id="ranking-label-placeholder" />}
                                        name        = "ranking"
                                        displayEmpty
                                    >
                                        <MenuItem value={"top"}>Top</MenuItem>
                                        <MenuItem value={"bottom"}>Bottom</MenuItem>
                                    </Select>
                                    <Select
                                        style       = {{width:"39%",marginLeft:"1%"}}
                                        value       = {numberOfItems}
                                        onChange    = {this.changeInput}
                                        input       = {<Input name="numberOfItems" id="numberOfItems-label-placeholder" />}
                                        name        = "numberOfItems"
                                        displayEmpty
                                    >
                                        {this.numChoices}
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