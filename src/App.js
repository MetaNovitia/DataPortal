import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { AppBar, Tabs, Tab } from '@material-ui/core';

import ChartsContainer from './components/ChartsContainer'

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: "white",
    },
    appbar: {
        background: "#DDDDDD",
    },
    tabIndicator: {
        backgroundColor: 'black'
    },
    topicContainter: {
        border: "5px solid transparent"
    }
});

class TopicTabs extends Component {

    constructor(props) {
        super(props);

        // initial states
        this.state = {
            projectData: undefined,
            projects: undefined,    // this stores all the avaible project names
            projectIndex: -1,         // index of the project that is currently selected.
            normalizerData: undefined
        }

        this.storage = {};

        // bind functions
        this.setProject = this.setProject.bind(this);
        this.setInit = this.setInit.bind(this);
        this.setData = this.setData.bind(this);
        this.setNormalizer = this.setNormalizer.bind(this);
        this.getNormalizer = this.getNormalizer.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    setNormalizer(n_data, fetched_projects){
        this.setState({
            projectIndex: 0,
            projectData: fetched_projects,
            projects: Object.keys(fetched_projects),
            normalizerData: n_data
        });
    }

    getNormalizer(fetched_projects){
        const n_data = require("./data/new/get/normalizer.json");
        this.setNormalizer(n_data, fetched_projects);
    }

    setInit(fetched_projects, fetched_data) {
        const projectName = Object.keys(fetched_projects)[0];
        this.storage[projectName] = fetched_data;
        this.getNormalizer(fetched_projects);
    }

    setProject(fetched_projects) {
        const projectName = Object.keys(fetched_projects)[0];
        const fetched_data = require("./data/new/get/" + projectName + ".json");
        this.setInit(fetched_projects, fetched_data);
    }

    setData(fetched_data, newValue) {
        const projectName = this.state.projects[newValue];
        this.storage[projectName] = fetched_data;
        this.setState({ projectIndex: newValue });
    }

    componentDidMount() {
        /*
        $.ajax({
            url: "https://54.219.61.146:5000/new/list",
            context: document.body,
            crossDomain: true
        }).done(this.set);*/
        // this.set(require("./data/new/list.json"));

        const fetched_projects = require("./data/new/list.json");
        this.setProject(fetched_projects);
    }

    handleTabChange(_, newValue) {
        if (this.state.topicIndex !== newValue) {
            if(!this.storage.hasOwnProperty(newValue)){
                const projectName = this.state.projects[newValue];
                const fetched_data = require("./data/new/get/" + projectName + ".json");
                this.setData(fetched_data, newValue);
            }else{
                this.setState({ projectIndex: newValue });
            }
        }
    }

    render() {

        const { projectData, projects, projectIndex, normalizerData } = this.state;
        const { classes } = this.props; // style classes

        if (projects === undefined) {
            return null;
        }

        const projectName = projects[projectIndex];

        return (
            <div className={classes.root}>
                <AppBar
                    position="static"
                    color="default">
                    <Tabs
                        className={classes.appbar}
                        value={projectIndex}
                        onChange={this.handleTabChange}

                        // TabIndicatorProps={classes.tabIndicator}
                        TabIndicatorProps={{className: classes.tabIndicator}}
                        indicatorColor="primary"

                        variant="scrollable"
                        scrollButtons="on"
                        textColor="inherit"
                    >
                        {projects.map((projectName, i) =>
                            <Tab key={i} label={projectName} />
                        )}
                    </Tabs>
                </AppBar>

                <div className={classes.topicContainter}>
                    <ChartsContainer 
                        projectName={projectName}
                        projectData={projectData[projectName]}
                        storage={this.storage[projectName]}
                        normalizerData={normalizerData}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(TopicTabs)