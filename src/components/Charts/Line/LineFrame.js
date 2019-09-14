import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, MenuItem, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'

import Switch from "react-switch";

import LineGraph from './LineGraph.js'

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

class LineFrame extends Component {

    constructor(props) {
        super(props);

        const { projectName, topicName, variableX, storage } = props;

        this.state = {
            previousProjectName: undefined,
            normalizerData: undefined,

            curve: "cardinal",
            stacked: false,
            selectedKeys: getRandomSubarray(Object.keys(storage), 6)
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
        const { classes, color, variableName, variableX, normalizerX, storage, projectName } = this.props;
        const colors = colormaps[color][10];

        const { stacked, curve, selectedKeys } = this.state;

        var title = projectName;
        if (normalizerX !== "None") {
            title = title + " / " + normalizerX
        }

        // ------------------------------------- block -------------------------------
        let filteredEntries = [];
        let filteredData = [];
        var year;
        if(selectedKeys.length>0){

            var min_year = undefined;
            var max_year = undefined;
            
            selectedKeys.sort().forEach(dataKey => {

                var normalizedEntry = {"id":dataKey};

                variableX.forEach(varKey => {
                    // initialize
                    if(normalizedEntry.data===undefined){
                        normalizedEntry.data = {};
                        for(year in storage[dataKey][varKey]) normalizedEntry.data[year] = 0;
                    }

                    // loop, will be undefined if not all variables have the value in that year
                    if(varKey==="3" && dataKey==="Livestock Head Total") console.log(storage[dataKey][varKey])
                    for(year in normalizedEntry.data){
                        if( storage[dataKey][varKey]        !== undefined &&    // missing item
                            storage[dataKey][varKey][year]  !== undefined &&    // missing year of item
                            normalizedEntry.data[year]      !== undefined)      // missing year of other items
                        {
                            
                            if(varKey==="3" && dataKey==="Livestock Head Total") console.log("HERE")
                            var variableEntryValue = Number(storage[dataKey][varKey][year]);
                            // if (normalizerX !== "None") normalizedEntry.data[year] += Number(variableEntryValue);
                            //     const normalizer = normalizerData[dataKey]
                            //     // pair = [t_year, t_value]
                            //     normalizedEntry = Object.entries(variableEntry).map(pair => {
                            //         if (parseFloat(normalizer[pair[0]]) === 0) {
                            //             return {
                            //                 "x": pair[0],
                            //                 "y": null
                            //             }
                            //         } else {
                            //             return {
                            //                 "x": pair[0],
                            //                 "y": pair[1] / normalizer[pair[0]]
                            //             }
                            //         }
                            //     })
                            // }

                            normalizedEntry.data[year] += variableEntryValue;

                        }else normalizedEntry.data[year] = undefined;
                    };
                })

                const years = Object.keys(normalizedEntry.data);
                const this_min_year = Math.min(...years);
                const this_max_year = Math.max(...years);

                if(min_year===undefined || this_min_year < min_year) min_year = this_min_year;
                if(max_year===undefined || this_max_year > max_year) max_year = this_max_year;

                filteredEntries.push(normalizedEntry);
            })

            filteredData = filteredEntries.map(entry => {
                var normalizedData = [];
                for(year=min_year; year<=max_year; year++){
                    if(entry.data[year]===undefined) entry.data[year]=null;
                    normalizedData.push({
                        "x": year.toString(),
                        "y": entry.data[year]
                    })
                }

                return {
                    "data": normalizedData,
                    "id": entry.id
                }
            });
        }
        // ------------------------------------- block -------------------------------

        return (
            <Grid container direction="row" justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={12} md={9} lg={9}>
                    <LineGraph
                        data={filteredData}
                        stacked={stacked}
                        area={stacked}
                        curve={curve}
                        title={title}
                        colors={colors}
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
                    <Grid item xs={12} className={classes.optionsContainer}>
                        <TextField select
                            className={classes.select}

                            label="Curve Type"
                            onChange={this.changeInput}
                            value={curve}
                            name="curve"
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value={'cardinal'}>Curved</MenuItem>
                            <MenuItem value={'linear'}  >Linear</MenuItem>
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

export default withStyles(styles)(LineFrame)