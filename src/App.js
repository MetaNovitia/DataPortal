import React, {Component} from 'react';
import projects from './data/projects.json'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Topic from './Topic/Topic.js'

export default class ScrollableTabs extends Component {

    constructor(props){
        super(props);
        this.state = {topicIndex: 0};
        this.handleChange = this.handleChange.bind(this);

        this.tabs = [];
        for(var i in projects){
            this.tabs.push(
                <Tab key={i.toString()+"topic"} label={projects[i].title}/>
            );
        }
    }

    handleChange(event, newValue) {
        this.setState({topicIndex: newValue});
    }

    render(){
        return (
            <div style={{
                flexGrow: 1,
                width: '100%',
                backgroundColor: "white",
            }}>
                <AppBar position="static" color="default">
                    <Tabs
                    TabIndicatorProps={{style: {backgroundColor: 'black'}}}
                    value={this.state.topicIndex}
                    onChange={this.handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="inherit"
                    >
                    {this.tabs}
                    </Tabs>
                </AppBar>
                <Topic topicIndex={this.state.topicIndex}/>
            </div>
        );
    }
}