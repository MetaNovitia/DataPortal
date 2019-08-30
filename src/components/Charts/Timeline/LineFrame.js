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
            curve           : "cardinal",
            stacked         : true,
            selectedKeys    : {}
        }

        this.data               = undefined;
        this.topicIndex         = -1;
        this.type               = "";
        this.category           = "None";
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

    set(data){
         
        this.data = data;
        this.done1 = true;

        this.variable       = this.props.variable;
        this.varchanged     = true;

        this.setState({});
    }

    
    render(){
        if(this.variable !== this.props.variable){
            this.done1 = false;
            // $.ajax({
            //     url: "https://54.219.61.146:5000/new/get/"+this.props.topicIndex,
            //     context: document.body,
            //     crossDomain: true
            // }).done(this.set);
            this.set(require(
                "../../../data/new/get/" + this.props.topicIndex+
                "/" + this.props.type +
                "/"+ this.props.variable +
                ".json"));

        }
        
        if(this.normalizer !== this.props.normalizer){
            this.done2 = false;
            if(this.props.normalizer!=="None"){
                // $.ajax({
                //     url: "https://54.219.61.146:5000/new/get/"+this.props.topicIndex,
                //     context: document.body,
                //     crossDomain: true
                // }).done(this.set);
                this.setNormalizer(require(
                    "../../../data/new/get/" + this.props.topicIndex+
                    "/" + this.props.type +
                    "/"+ this.props.normalizer +
                    ".json"));
            }else{
                this.setNormalizer("None");
            }
        }

        if(this.done1 && this.done2){

            // ============================ General ========================== //
            var i = 0;      // array index
            var ct = 0;     // counter
            var key = "";   // object key

            // ============================= Init ============================= //
            var stacked         = this.options["stacked"];
            var curve           = this.options["curve"];
            var category        = this.options["category"];
            var type            = this.props.type;
            var colorType       = this.props.colorType;

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
                for(key in this.data){
                    this.options["selectedKeys"][key] = ((ct++ % maxInitalKeys === 0) && ct!==1);
                }

                this.options["category"] = "None";
                category = this.options["category"];
            }

            if(this.type != type || this.color!=this.props.color){
                this.groups = {};
                if(colorType === "Numerical"){
                    var vItems = Object.keys(this.data);

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
                this.filteredData       = [];
                this.filteredColors     = [];
                
                var temp_years_index    = Object.keys(this.data[Object.keys(this.data)[0]]);
                var years_index         = {};
                for(i in temp_years_index){
                    years_index[temp_years_index[i]] = i;
                }

                // filter
                for(key in this.options.selectedKeys){
                    if(this.options.selectedKeys[key]){
                        var t_entry = this.data[key];
                        var normalizedEntry = {data:[],id:key};

                        // normalize data
                        for(var t_year in t_entry){

                            var t_value         = t_entry[t_year];
                            var t_index         = years_index[t_year];
                            if(this.normalizer !== "None"){
                                console.log(this.normalizerdata);
                                var t_normalizer    = this.normalizerdata[key][t_year];
                                if(t_normalizer!==undefined && t_normalizer!==0 && t_normalizer!==0.0){
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

            this.category           = category;
            this.selectedChanged    = false;
            this.normchanged        = false;
            this.varchanged         = false;
            this.type               = type;
            this.color              = this.props.color;
            var title               = this.variable + " / "+ this.normalizer;
            if(this.normalizer==="None") title = this.variable

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
                                            title   = {title}
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
                                        <MenuItem value={"None"}>None</MenuItem>
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