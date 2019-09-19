// missing data will not be shown

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, MenuItem, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'

import Switch from "react-switch";

import BarGraph from './BarGraph.js'

import colormaps from '../../../color'

const styles = theme => ({
    optionsContainerRoot: {
        padding: '2%',
        overflow: "scroll",
    },
    optionsContainer: {
        margin: theme.spacing(0, 0, 3, 0)
    },
    select: {
        width: "90%"
    },
    legends: {
        maxHeight: "310px"
    },
    formControl: {
        margin: theme.spacing(0, 0, 0, 0),
    },
});

// choose n random values from array
// credit to https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
function getRandomSubarray(arr, n) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, n);
}

class BarFrame extends Component {

    constructor(props) {
        super(props);

        const { projectName, topicName, storage } = props;

        this.state = {
            previousProjectName: undefined,
            normalizerData: undefined,

            curve: "cardinal",
            stacked: true,
            selectedKeys: getRandomSubarray(Object.keys(storage), 6),
            ranking         : "top",
            numberOfItems   : 10
        }

        this.changeInput = this.changeInput.bind(this);
        this.checkBox = this.checkBox.bind(this);
    }

    // ============================ Input Handlers ========================== //
    checkBox(event, checked) {
        const { selectedKeys } = this.state

        if (selectedKeys.length === 10 && checked) {
            // maximum data point comparision exceed, do nothing
            return;
        }

        const name = event.target.name;
        const index = selectedKeys.indexOf(name);

        if (index >= 0) {
            selectedKeys.splice(index, 1)
        } else {
            selectedKeys.push(name)
        }
        this.setState({
            selectedKeys: selectedKeys
        })
    }

    changeInput(event) {
        if (event === "stacked") {
            this.setState({
                stacked: !this.state.stacked
            })
        } else {
            this.setState({
                [event.target.name]: event.target.value
            })
        }
    }

    render() {
        const { classes, color, variableName, normalizerX, storage, projectName, normalizerData } = this.props;
        const colors = colormaps[color][10];

        const { stacked, curve, selectedKeys,numberOfItems, ranking } = this.state;

        var title = projectName;
        if (normalizerX !== "None") {
            title = title + " / " + normalizerX
        }

        // ------------------------------------- block -------------------------------
        let filteredEntries = {};
        let filteredData = [];
        var year, item;

        if(selectedKeys.length>0){

            selectedKeys.sort().forEach(dataKey => {
                for(var varKey in storage[dataKey]){
                    for(year in storage[dataKey][varKey]){

                        if(filteredEntries[year]===undefined){
                            filteredEntries[year]={};
                        }

                        if(filteredEntries[year][varKey]===undefined) 
                            filteredEntries[year][varKey]={_total:0};
                        
                        var variableEntryValue = Number(storage[dataKey][varKey][year]);
                        if (normalizerX === "None") {
                            filteredEntries[year][varKey][dataKey] = variableEntryValue;
                            filteredEntries[year][varKey]._total += variableEntryValue;
                        }
                        else {
                            if( normalizerData[normalizerX].hasOwnProperty(varKey) &&
                                normalizerData[normalizerX][varKey].hasOwnProperty(year) &&
                                parseFloat(normalizerData[normalizerX][varKey][year]) !== 0){
                                const normalizer = normalizerData[normalizerX][varKey][year];
                                variableEntryValue /= normalizer;
                                filteredEntries[year][varKey][dataKey] = variableEntryValue;
                                filteredEntries[year][varKey]._total += variableEntryValue;
                            }
                        }
                    };
                }
            })

            Object.keys(filteredEntries).sort().forEach(year => {

                const entry = filteredEntries[year];
                var max_stacked = undefined;
                var max_value = undefined;
                var normalizedData = [];
                for(item in entry){
                    if(Object.keys(entry[item]).length-1===selectedKeys.length){
                        normalizedData.push({"id": item,...entry[item]});
                        if(max_stacked===undefined || max_stacked<entry[item]._total) 
                            max_stacked = entry[item]._total;

                        for(var value in entry[item]){
                            const curr_v = entry[item][value];
                            if(max_value===undefined || curr_v > max_value) max_value = curr_v;
                        }
                    }
                }

                filteredData.push([year,normalizedData,max_stacked, max_value])
            });
        }

        // ------------------------------------- block -------------------------------

        return (
            <Grid container direction="row" justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={12} md={9} lg={9}>
                    <BarGraph
                        data            = {filteredData} 
                        groupMode       = {stacked}
                        title           = {title}
                        pkeys           = {selectedKeys}
                        numberOfItems   = {numberOfItems}
                        ranking         = {ranking}
                        colors          = {colors}
                    />
                </Grid>
                <Grid item container xs={12} sm={12} md={3} lg={3} className={classes.optionsContainerRoot}  style={{ maxHeight: "580px" }}>
                    <Grid item xs={12} style={{ display: 'flex' }} className={classes.optionsContainer}>
                        <Switch onColor="#222429"
                            onChange={() => { this.changeInput("stacked") }}
                            checked={stacked}
                            value={stacked} />
                        <div style={{ marginLeft: "4%", fontFamily: "Verdana" }}>Stacked</div>
                    </Grid>
                    <Grid item xs={8} className={classes.optionsContainer}>
                        <TextField select
                            className={classes.select}

                            label="Ranking"
                            onChange={this.changeInput}
                            value={ranking}
                            name="ranking"
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value={'top'}>Top</MenuItem>
                            <MenuItem value={'bottom'}  >Bottom</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={4} className={classes.optionsContainer}>
                        <TextField select
                            className={classes.select}

                            label=" "
                            onChange={this.changeInput}
                            value={numberOfItems}
                            name="numberOfItems"
                            InputLabelProps={{ shrink: true }}
                        >
                            {[5,10,15,20,25,30].map(key=> <MenuItem key={key} value={key}>{key}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} className={classes.optionsContainer}>
                        {selectedKeys.map(dataKey =>
                            <FormControlLabel key={dataKey} label={dataKey}
                                control={<Checkbox name={dataKey} checked={true} onChange={this.checkBox} />}
                            />
                        )}
                        <hr/>
                        {Object.keys(storage).map((dataKey, i) => {
                            return !selectedKeys.includes(dataKey) && <FormControlLabel key={i} label={dataKey}
                                control={<Checkbox name={dataKey} checked={false} onChange={this.checkBox} />}
                            />
                        })}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(BarFrame)