import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, MenuItem, FormControl, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'

import Switch from "react-switch";

import ScatterGraph from './ScatterGraph.js'

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

class ScatterFrame extends Component {

    constructor(props) {
        super(props);

        const { groups } = props;

        this.state = {
            previousProjectName: undefined,
            topicName: undefined,
            normalizerData: undefined,

            selectedKeys: getRandomSubarray(Object.keys(groups), 6)
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

    static getDerivedStateFromProps(props, state) {
        if(props.topicName !== state.topicName){
            return{
                topicName: props.topicName,
                selectedKeys: getRandomSubarray(Object.keys(props.groups), 6)
            }
        }
    }

    render() {
        const { classes, color, variableX, normalizerX, 
                storage, projectName,variableY, normalizerY, groups} = this.props;
        const colors = colormaps[color][10];

        const { stacked, curve, selectedKeys } = this.state;

        var title = projectName;
        if (normalizerX !== "None") {
            title = title + " / " + normalizerX
        }

        /*
        [year,[
            {
                "id": "group A",
                "data": [
                {
                    "x": 7,
                    "y": 54
                }]
            }
        ]]

        */

        // ------------------------------------- block -------------------------------
        let filteredEntries = {};
        let filteredData = [];
        var year, item;
        if(selectedKeys.length>0){
            selectedKeys.sort().forEach((key,i)=>{
                groups[key].forEach(item=>{
                    for(year in storage[variableX][item]){

                        if(filteredEntries[year]===undefined){
                            filteredEntries[year]={};
                        }

                        if(filteredEntries[year][item]===undefined) 
                            filteredEntries[year][item]=[];
                        
                        const variableEntryX = storage[variableX][item][year];
                        if(storage[variableY][item]!==undefined){
                            const variableEntryY = storage[variableY][item][year];
                            if (normalizerX === "None") {
                                filteredEntries[year][item].push({
                                    "x":Number(variableEntryX),
                                    "y":Number(variableEntryY),
                                    "color":colors[i],
                                    "this_id":key
                                });
                            }
                        }
                        
                        // else {
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
                    }
                })
                
            })

            filteredData = Object.keys(filteredEntries).sort().map(year => {
                const entry = Object.keys(filteredEntries[year])
                return [year, entry.sort().map(key=>{
                    if(filteredEntries[year][key] === undefined) filteredEntries[year][key] = [];
                    return {"id": key, "data":filteredEntries[year][key]}
                })]
            });
        }

        // ------------------------------------- block -------------------------------
        const show = Object.keys(groups).length > 1;
        return (
            <Grid container direction="row" justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={12} md={show ? 9 : 12} lg={show ? 9 : 12}>
                    <ScatterGraph
                        titleX={variableX}
                        titleY={variableY}
                        dataGenerator={filteredData}
                        colors={colors}
                    />
                </Grid>
                { show &&
                <Grid item container xs={12} sm={12} md={3} lg={3} className={classes.optionsContainerRoot} style={{ maxHeight: "580px" }}>
                    <Grid item xs={12} className={classes.optionsContainer}>
                        {selectedKeys.sort().map((dataKey,i) => {

                            var CustomCheckbox = withStyles({
                                root: {
                                    color: colors[i]
                                }
                            })(props => <Checkbox color="default" {...props} />);

                            return (
                                <Grid item xs={12}>
                                <FormControlLabel key={dataKey} label={dataKey}
                                    control={
                                <CustomCheckbox name={dataKey} checked={true} onChange={this.checkBox} />}
                            /></Grid>);
                        })}
                        <hr/>
                        {Object.keys(groups).sort().map((dataKey, i) => {
                            return !selectedKeys.includes(dataKey) && 
                            <Grid item xs={12}>
                                <FormControlLabel key={i} label={dataKey}
                                    control={
                                    <Checkbox name={dataKey} checked={false} onChange={this.checkBox} />
                                }
                            /></Grid>
                        })}
                    </Grid>
                </Grid>}
            </Grid>
        );
    }
}

export default withStyles(styles)(ScatterFrame)