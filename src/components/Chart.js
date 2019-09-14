import React, { Component } from 'react';

import { withStyles } from '@material-ui/styles';
import { Grid, MenuItem, FormControl, TextField } from '@material-ui/core'

import LineFrame from './Charts/Line/LineFrame'
import BarFrame from './Charts/Bar/BarFrame'
import ScatterFrame from './Charts/Scatter/ScatterFrame'

// import MapFrame from './Charts/Map/MapFrame'

import colors from '../color'

const styles = theme => ({
    chartContainer: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: "white",

        padding: 0,
        margin: 0,
    },
    gridContainer: {
        padding: "10px"
    },
    formControl: {
        width: "100%",
        marginTop: "10px",
    },
    select: {
        height: "40px"
    }
});

const graphSettings = {
    0: {
        varTitle: "Item"
    },
    1: {
        varTitle: "Item"
    },
    2: {
        varTitle: "Variable X"
    },
    3: {
        varTitle: "Variable"
    }
}

class Chart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            topicName: "None",
            projectName: undefined,

            graphIndex: undefined,

            variableX: undefined,
            variableY: undefined,

            normalizerX: "None",
            normalizerY: "None",

            color: "jet",
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var eventName = event.target.name;
        var eventValue = event.target.value;

        // no need to update if no value is changed
        if (this.state[eventName] === eventValue) {
            return;
        }

        const { projectData, storage, graphIndex } = this.props;
        const { topicName } = this.state;

        this.setState({
            [eventName]: eventValue
        })
        if (eventName === "topicName") {

            const variableNames = graphIndex === 0 ? 
                                Object.keys(projectData.groups[eventValue][0]) :
                                Object.keys(storage);

            this.setState({
                topicName: eventValue,
                variableNames: variableNames,
                variableX: variableNames[0],
                variableY: variableNames.length > 1 ? variableNames[1] : variableNames[0],

                normalizerX: "None",
                normalizerY: "None"
            });
        }
    }

    static getDerivedStateFromProps(props, state) {


        const { projectData, storage, graphIndex, projectName } = props;

        if (state.projectName !== projectName || state.graphIndex !== graphIndex) {

            var variableNames = graphIndex === 0 ? 
                                Object.keys(projectData.groups["None"][0]) : 
                                Object.keys(storage);

            return {
                projectName: projectName,
                topicName: graphIndex === 2 ? "All" : "None",

                graphIndex: graphIndex,

                variableX: variableNames[0],
                variableY: variableNames.length > 1 ? variableNames[1] : variableNames[0],

                normalizerX: "None",
                normalizerY: "None",
            }
        }
        return {}
    }

    render() {

        const { classes, projectName, graphIndex, projectData, storage } = this.props

        const { topicName, normalizerX, color, variableX,variableY,normalizerY } = this.state

        // const topicType = topicInfo[topicName].Type
        const keys = Object.keys(projectData.groups)
        var variableNames = undefined;
        var items = undefined;

        if(graphIndex === 0){
            variableNames = Object.keys(projectData.groups[topicName][0]);
            items = projectData.groups[topicName][0][variableX];
        }
        else                    variableNames = Object.keys(storage)

        // this.graph = <MapFrame />
        this.graph = [
            <LineFrame
                projectName={projectName}
                topicName={topicName}

                variableX={items}
                variableName={variableX}
                normalizerX={normalizerX}

                color={color}

                storage={storage}
            />,
            <BarFrame
                projectName={projectName}
                topicName={topicName}

                variableName={variableX}
                normalizerX={normalizerX}

                color={color}

                storage={storage}
                groups={projectData.groups}
            />,
            <ScatterFrame
                projectName={projectName}
                topicName={topicName}

                variableX={variableX}
                normalizerX={normalizerX}

                variableY={variableY}
                normalizerY={normalizerY}

                color={color}

                groups={projectData.groups[topicName][0]}
                storage={storage}
            />,
            // <MapFrame />,
            null,null,null,null
        ][this.props.graphIndex];


        const gridLayout = graphIndex === 2 ? 4 : 6;
        const { varTitle } = graphSettings[graphIndex]
        
        return (
            <React.Fragment>
                <Grid container direction="row" justify="center" alignItems="center" className={classes.chartContainer}>
                    {/* // --------------------------- Type & Color --------------------------- // */}
                    <Grid item xs={12} sm={gridLayout} md={gridLayout} lg={gridLayout} className={classes.gridContainer}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <TextField select
                                // disabled={0!==graphIndex && 1!==graphIndex}
                                variant="outlined"
                                label="Group By"
                                onChange={this.handleChange}
                                value={this.state.topicName}
                                name="topicName"
                                SelectProps={{ className: classes.select }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {keys.map((key, i) => (
                                    <MenuItem key={i} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <TextField select
                                variant="outlined"
                                label="Color Map"
                                onChange={this.handleChange}
                                value={this.state.color}
                                name="color"
                                SelectProps={{ className: classes.select }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {Object.keys(colors).map(key => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>
                    {/* // --------------------------- Variable ------------------------------- // */}
                    <Grid item xs={12} sm={gridLayout} md={gridLayout} lg={gridLayout} className={classes.gridContainer}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <TextField select
                                disabled={1===graphIndex}
                                variant="outlined"
                                label={varTitle}
                                onChange={this.handleChange}
                                value={variableX}
                                name={"variableX"}
                                SelectProps={{ className: classes.select }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {variableNames.map(key => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <TextField select
                                disabled
                                variant="outlined"
                                label="Normalizer"
                                onChange={this.handleChange}
                                value={this.state.normalizerX}
                                name="normalizerX"
                                SelectProps={{ className: classes.select }}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem key={"None"} value={"None"}>None</MenuItem>
                                {variableNames.map(key => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>
                    {/* // --------------------------- Variable Y (Scatter) ------------------- // */}
                    { this.props.graphIndex === 2 && <Grid item xs={12} sm={gridLayout} md={gridLayout} lg={gridLayout} className={classes.gridContainer}>
                        <FormControl variant="outlined" style={{ width: "100%", marginTop: "10px" }}>
                            <TextField select
                                variant="outlined"
                                label="Variable Y"
                                onChange={this.handleChange}
                                value={this.state.variableY}
                                name="variableY"
                                SelectProps={{ className: classes.select }}
                                InputLabelProps={{ shrink: true }}
                            >
                                {variableNames.map(key => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                        <FormControl variant="outlined" style={{ width: "100%", marginTop: "10px" }}>
                            <TextField select
                                disabled
                                variant="outlined"
                                label="Normalizer Y"
                                onChange={this.handleChange}
                                value={this.state.normalizerY}
                                name="normalizerY"
                                SelectProps={{ className: classes.select }}
                                InputLabelProps={{ shrink: true }}
                            >
                                <MenuItem key={"None"} value={"None"}>
                                    None
                            </MenuItem>
                                {variableNames.map(key => (
                                    <MenuItem key={key} value={key}>
                                        {key}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>}
                </Grid>
                {this.graph}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Chart)