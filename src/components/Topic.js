import React, { Component } from 'react';

import { withStyles } from '@material-ui/styles';

import LineFrame from './Charts/Line/LineFrame.js'
import BarFrame from './Charts/Bar/BarFrame.js'
import ScatterFrame from './Charts/Scatter/ScatterFrame.js'
import { Row } from 'reactstrap';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    chartContainer: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: "white",
    },
    row: {
        padding: "0",
        margin: "0",
        width: "100%",
        alignItems: "center"
    },

    formControl: {
        width: "100%", 
        marginTop: "10px"
    }
});

class Chart extends Component {

    constructor(props) {
        super(props);
        this.data = {};
        this.set = this.set.bind(this);
        this.state = {
            typeIndex: "",
            variable: "",
            variableY: "",
            mul: [],
            color: "jet",
            normalizer: "None",
            normalizerY: "None",
            changedMul: false
        };
        this.keys = [];
        this.type = null;
        this.variables = [];
        this.variablesMenu = [];

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var newV = event.target.value;
        var name = event.target.name;

        if (name === "typeIndex") {
            this.variables = this.data[newV].variables;
            var i = 0;
            if (this.variables.length > 1) {
                i = 1
            };
            this.setState({
                typeIndex: newV,
                variable: this.variables[0],
                variableY: this.variables[i],
                mul: [this.variables[0]],
                changedMul: !this.state.changedMul,
                color: "jet",
                normalizer: "None",
                normalizerY: "None"
            });
        } else {
            var obj = {};
            obj[name] = newV;
            if (name === "mul") obj["changedMul"] = !this.state.changedMul;
            this.setState(obj);
        }
    }

    set(types) {
        this.data = types;
        this.keys = Object.keys(types);
        this.handleChange({ target: { name: "typeIndex", value: this.keys[0] } });
    }

    reload() {
        // $.ajax({
        //     url: "https://52.8.81.15:5000/new/list",
        //     context: document.body,
        //     crossDomain: true
        // }).done(this.set);
        this.topicIndex = this.props.topicIndex;
        this.set(require("../data/new/get/" + this.props.topicIndex + "/metadata.json").list);
    }


    render() {

        const { classes } = this.props 

        if (this.topicIndex !== this.props.topicIndex) {
            this.reload();
            return null;
        }
        else {
            this.graph = [
                <LineFrame
                    topicIndex={this.props.topicIndex}
                    normalizer={this.state.normalizer}
                    color={this.state.color}
                    colorType={this.data[this.state.typeIndex].Type}
                    type={this.state.typeIndex}

                    variable={this.state.variable}
                />,
                <BarFrame
                    topicIndex={this.props.topicIndex}
                    normalizer={this.state.normalizer}
                    color={this.state.color}
                    colorType={this.data[this.state.typeIndex].Type}
                    type={this.state.typeIndex}

                    mul={this.state.mul}
                    changedMul={this.state.changedMul}
                />,
                <ScatterFrame
                    topicIndex={this.props.topicIndex}
                    normalizer={this.state.normalizer}
                    color={this.state.color}
                    colorType={this.data[this.state.typeIndex].Type}
                    type={this.state.typeIndex}

                    variable={this.state.variable}
                    variableY={this.state.variableY}
                    normalizerY={this.state.normalizerY}
                />,
                null, null, null, null
            ][this.props.graphIndex];

            var w = "50%";
            var dY = "none";
            var varTitle = "Variable";
            var x = "variable";
            var mul = false;
            var h = "40px";
            var mulw = 60;
            if (this.props.graphIndex === 2) {
                w = "33%";
                mulw = 80;
                dY = "initial";
                varTitle = "Variable X";
            } else if (this.props.graphIndex === 1) {
                varTitle = "Variables (select multiple)";
                mulw = 190;
                x = "mul";
                mul = true;
            }

            return (
                <div className={classes.chartContainer}>
                    <Row style={{ padding: "0", margin: "0", width: "100%", alignItems: "center" }}>
                        {/* // --------------------------- Type & Color --------------------------- // */}
                        <div style={{ width: w, padding: "10px" }}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel shrink htmlFor="typeIndex-label-placeholder">
                                    Points
                                </InputLabel>
                                <Select
                                    style={{ width: "100%", height: h }}
                                    value={this.state.typeIndex}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput
                                        name="typeIndex"
                                        labelWidth={45}
                                        id="typeIndex-label-placeholder" />}
                                    name="typeIndex"
                                    displayEmpty
                                >
                                    {this.keys.map(key => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel shrink htmlFor="color-label-placeholder">
                                    Color Map
                                </InputLabel>
                                <Select
                                    style={{ width: "100%", height: h }}
                                    value={this.state.color}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput
                                        name="color"
                                        labelWidth={80}
                                        id="color-label-placeholder" />}
                                    name="color"
                                    displayEmpty
                                >
                                    {["jet", "cool", "hot"].map(key => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        {/* // --------------------------- Variable --------------------------- // */}
                        <div style={{ width: w, padding: "10px" }}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel shrink htmlFor="variable-label-placeholder">
                                    {varTitle}
                                </InputLabel>
                                <Select
                                    multiple={mul}
                                    style={{ width: "100%", height: h }}
                                    value={this.state[x]}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput
                                        name={x}
                                        labelWidth={mulw}
                                        id="variable-label-placeholder" />}
                                    name={x}
                                    displayEmpty
                                >
                                    {this.variables.map(key => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {React.useRef}
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel shrink htmlFor="normalizer-label-placeholder">
                                    Normalizer
                                </InputLabel>
                                <Select
                                    style={{ width: "100%", height: h }}
                                    value={this.state.normalizer}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput
                                        name="normalizer"
                                        labelWidth={82}
                                        id="normalizer-label-placeholder" />}
                                    name="normalizer"
                                >
                                    <MenuItem key={"None"} value={"None"}>
                                        None
                                    </MenuItem>
                                    {this.variables.map(key => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        {/* // --------------------------- Variable Y (Scatter) --------------------------- // */}
                        <div style={{ width: w, padding: "10px", display: dY }}>
                            <FormControl variant="outlined" style={{ width: "100%", marginTop: "10px" }}>
                                <InputLabel shrink htmlFor="variableY-label-placeholder">
                                    Variable Y
                                </InputLabel>
                                <Select
                                    style={{ width: "100%", height: h }}
                                    value={this.state.variableY}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput
                                        name="variableY"
                                        labelWidth={mulw}
                                        id="variableY-label-placeholder" />}
                                    name="variableY"
                                    displayEmpty
                                >
                                    {this.variables.map(key => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" style={{ width: "100%", marginTop: "10px" }}>
                                <InputLabel shrink htmlFor="normalizerY-label-placeholder">
                                    Normalizer
                                </InputLabel>
                                <Select
                                    style={{ width: "100%", height: h }}
                                    value={this.state.normalizerY}
                                    onChange={this.handleChange}
                                    input={<OutlinedInput
                                        name="normalizerY"
                                        labelWidth={82}
                                        id="normalizerY-label-placeholder" />}
                                    name="normalizerY"
                                >
                                    <MenuItem key={"None"} value={"None"}>
                                        None
                                    </MenuItem>
                                    {this.variables.map(key => (
                                        <MenuItem key={key} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <br />
                    </Row>
                    {this.graph}
                </div>
            );
        }
    }
}

export default withStyles(styles)(Chart)