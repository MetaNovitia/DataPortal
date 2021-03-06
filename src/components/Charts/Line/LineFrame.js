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

	cleanUpData(data) {
		function linearInterpolation(numNull, indexPrev, indexNext, dataVals) {
			if (indexPrev === null && indexNext === null)
				return;
			for (var i = indexPrev + 1; i < indexNext; ++i)
				dataVals[i]["y"] = -1
			if (dataVals[indexPrev]["y"] == null && dataVals[indexNext]["y"] != null) {
				for (var i = indexPrev + 1; i < indexNext; ++i)
					dataVals[i]["y"] = dataVals[indexNext]["y"]
			} else if (dataVals[indexPrev]["y"] != null && dataVals[indexNext]["y"] == null) {
				for (var i = indexPrev + 1; i < indexNext; ++i)
					dataVals[i]["y"] = dataVals[indexPrev]["y"]
			} else if (dataVals[indexPrev]["y"] != null && dataVals[indexNext]["y"] != null) {
				var incrementBy = (dataVals[indexNext]["y"] - dataVals[indexPrev]["y"]) / numNull
				for (var i = indexPrev + 1; i < indexNext; ++i)
					dataVals[i]["y"] = dataVals[indexPrev]["y"] + ((i - indexPrev - 1) * incrementBy)
			}
		}

		for (var i = 0; i < data.length; ++i) {
			var prevIndex = null
			for (var j = 0; j < data[i]["data"].length; ++j) {
				var nextIndex = null
				if (data[i]["data"][j]["y"] != null)
					prevIndex = j
				else if (data[i]["data"][j]["y"] == null) {
					var nullCount = 0
					while (j < data[i]["data"].length && data[i]["data"][j]["y"] == null) {
						++nullCount
						++j
					}
					if (j < data[i]["data"].length)
						nextIndex = j
					linearInterpolation(nullCount, prevIndex, nextIndex, data[i]["data"])
				}
			}
		}


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
        const { classes, color, variableName, variableX, normalizerX, storage, projectName, normalizerData } = this.props;
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
        var min_value = undefined;
        var max_value = undefined;
        var stacked_values = [];
        var max_stacked = undefined;
		if(selectedKeys.length>0) {
	
		    var min_year = undefined;
		    var max_year = undefined;

			console.log("--------------")
			console.log(selectedKeys)
		    
		    selectedKeys.sort().forEach(dataKey => {
	
		        var normalizedEntry = {"id":dataKey};
	
		        variableX.forEach(varKey => {
		            // initialize
		            if(normalizedEntry.data===undefined){
		                normalizedEntry.data = {};
		                for(year in storage[dataKey][varKey]) normalizedEntry.data[year] = 0;
		            }
	
		            for(year in normalizedEntry.data){
		                if( storage[dataKey][varKey]        !== undefined &&    // missing item
		                    storage[dataKey][varKey][year]  !== undefined &&    // missing year of item
		                    normalizedEntry.data[year]      !== undefined)      // missing year of other items
		                {
		                    
		                    var variableEntryValue = Number(storage[dataKey][varKey][year]);
		                    if (normalizerX !== "None"){
	
		                        if( normalizerData[normalizerX].hasOwnProperty(varKey) &&
		                            normalizerData[normalizerX][varKey].hasOwnProperty(year) &&
		                            parseFloat(normalizerData[normalizerX][varKey][year]) !== 0){
	
		                            const normalizer = normalizerData[normalizerX][varKey][year];
		                            normalizedEntry.data[year] += variableEntryValue/normalizer;
	
		                        }else normalizedEntry.data[year] = undefined;
	
		                    }else normalizedEntry.data[year] += variableEntryValue;
	
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
	
		    for(year=min_year; year<=max_year; year++) stacked_values.push(0);
	
		    filteredData = filteredEntries.map(entry => {
		        var normalizedData = [];
		        for(year=min_year; year<=max_year; year++){
		            if(entry.data[year]===undefined){
		                entry.data[year]=null;
		                stacked_values[year-min_year] = null;
		            }
		            else{
		                var val = entry.data[year];
		                if(min_value===undefined || val < min_value) min_value = val;
		                if(max_value===undefined || val > max_value) max_value = val;
		                if(stacked_values[year-min_year]!==null) 
		                    stacked_values[year-min_year] += val;
		            }
	
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

		this.cleanUpData(filteredData)


        stacked_values.forEach(item => {
            if(item !== null && (max_stacked===undefined || max_stacked < item)) max_stacked = item;
        })


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
                        min_value={min_value}
                        max_value={max_value}
                        max_stacked={max_stacked}
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
