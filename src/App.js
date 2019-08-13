import React, {Component} from 'react';
import projects from './data/projects.json'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Topic from './Topic/Topic.js'
import $ from 'jquery';

export default class ScrollableTabs extends Component {

    constructor(props){
        super(props);
        this.data = "";
        this.set = this.set.bind(this);
        this.state = {topicIndex: -1};
        this.handleChange = this.handleChange.bind(this);
        this.tabs = [];
        this.topic = null;
        
    }

    set(projects){
        this.projects = [];
        this.tabs = [];
        for(var i in projects){
            this.projects.push(projects[i]);
            this.tabs.push(
                <Tab key={i.toString()+"topic"} label={projects[i]}/>
            );
        }
        this.topic = <Topic topicIndex={this.projects[0]}/>;
        this.setState({});
    }

    componentDidMount(){
        $.ajax({
            url: "http://54.219.61.146:5000/new/list",
            context: document.body,
            crossDomain: true
        }).done(this.set);
    }

    handleChange(event, newValue) {
        if(this.state.topicIndex!==newValue){
            this.topic = <Topic topicIndex={this.projects[newValue]}/>;
            this.setState({topicIndex: newValue});
        }
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
                {this.topic}
            </div>
        );
    }
}