import React, { Component } from 'react';

import { withStyles } from '@material-ui/styles';
import { AppBar, Tabs, Tab, Button } from '@material-ui/core';

import LineIcon from '@material-ui/icons/Timeline';
import BarIcon from '@material-ui/icons/Notes';
import ScatterIcon from '@material-ui/icons/ScatterPlot';
import MapIcon from '@material-ui/icons/Map';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import htmlToImage from 'html-to-image';
import Topic from './Chart'

const styles = theme => ({
    rootContainer: {
        flexGrow: 1,
        width: '100%'
    },
    tabContainer: {
        background: "gray"
    },
    tabIndicator: {
        backgroundColor: 'black'
    },

    downloadButton: {
        textAlign: "right"
    },
    downloadIcon: {
        marginLeft: "10px"
    }
});

class ChartsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphIndex: 0
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.download = this.download.bind(this);
    }

    download() {
        htmlToImage.toBlob(document.getElementById('dp-graphdiv'))
            .then(blob => {
                window.saveAs(blob, 'graph.png');
            }).catch(error => {
                console.log(error)
                alert("Please download using Google Chrome");
            });
    }

    // newValue is the index of the tab clicked
    handleTabChange(_, newValue) {
        this.setState({ graphIndex: newValue });
    }

    render() {
        const { classes, projectName, projectData } = this.props;
        const { graphIndex } = this.state;  // this is index of chart 

        return (
            <div className={classes.rootContainer}>
                <AppBar position="static">
                    <Tabs
                        className={classes.tabContainer}
                        TabIndicatorProps={{ className: classes.tabIndicator }}

                        value={graphIndex}
                        onChange={this.handleTabChange}

                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="inherit"
                    >
                        <Tab key="Line" label="Line" icon={<LineIcon />} />
                        <Tab key="Bar" label="Bar" icon={<BarIcon />} />
                        <Tab key="Scatter" label="Scatter" icon={<ScatterIcon />} />
                        <Tab key="Map" label="Map" icon={<MapIcon />} />
                    </Tabs>
                </AppBar>

                <Topic 
                    storage={this.props.storage}
                    projectData={projectData}
                    projectName={projectName} 
                    graphIndex={graphIndex} />

                {/* <br />
                <div className={classes.downloadButton}>
                    <Button onClick={this.download} color="default" variant="contained">
                        Download <CloudDownloadIcon className={classes.downloadIcon} />
                    </Button>
                </div> */}
            </div>
        );
    }
}

export default withStyles(styles)(ChartsContainer)