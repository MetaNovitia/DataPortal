import React, {Component} from 'react';
import LineFrame from '../Timeline/LineFrame.js'
import BarFrame from '../Bar/BarFrame.js'
import ScatterFrame from '../Scatter/ScatterFrame.js'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LineIcon from '@material-ui/icons/Timeline';
import BarIcon from '@material-ui/icons/Notes';
import ScatterIcon from '@material-ui/icons/ScatterPlot';
import MapIcon from '@material-ui/icons/Map';

const graphTypes = ["Line", "Bar", "Scatter", "Map"];
const graphIcons = [<LineIcon />,<BarIcon />,<ScatterIcon />,<MapIcon />];

export default class Topic extends Component {

    constructor(props){
        super(props);
        this.state          = {graphIndex:0};
        this.changeInnerTab = this.changeInnerTab.bind(this);
        this.graphtabs      = [];
        this.graph          = <LineFrame topicIndex={this.props.topicIndex}/>;

        for(var i in graphTypes){
            this.graphtabs.push(<Tab key={graphTypes[i]} label={graphTypes[i]} icon={graphIcons[i]}/>);
        }
        
    }

    changeInnerTab(event, newValue){
        this.graph = [
            <LineFrame topicIndex={this.props.topicIndex}/>,
            <BarFrame topicIndex={this.props.topicIndex}/>,
            <ScatterFrame topicIndex={this.props.topicIndex}/>,
            <LineFrame topicIndex={this.props.topicIndex}/>
        ][newValue];
        this.setState({graphIndex: newValue});
    }

    render(){

        return (
            <div style={{
                flexGrow: 1,
                width: '100%'
            }}>

                <AppBar position="static">
                    <Tabs
                        TabIndicatorProps   = {{style: {backgroundColor: 'black'}}}
                        value               = {this.state.graphIndex}
                        onChange            = {this.changeInnerTab}
                        variant             = "scrollable"
                        scrollButtons       = "on"
                        indicatorColor      = "primary"
                        textColor           = "inherit"
                        style               = {{background:"gray"}}
                        >
                    {this.graphtabs}
                    </Tabs>
                </AppBar>
                    {this.graph}
                <br />
                
                {/* <div><GrabData url="http://13.56.207.238:5000/database/1"/></div> */}
            </div>
        );
    }
}