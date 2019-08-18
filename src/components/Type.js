import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LineIcon from '@material-ui/icons/Timeline';
import BarIcon from '@material-ui/icons/Notes';
import ScatterIcon from '@material-ui/icons/ScatterPlot';
import MapIcon from '@material-ui/icons/Map';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import htmlToImage from 'html-to-image';
import Topic from './Topic.js'
// import { saveAs } from 'file-saver';

const graphTypes = ["Line", "Bar", "Scatter", "Map"];
const graphIcons = [<LineIcon />,<BarIcon />,<ScatterIcon />,<MapIcon />];

export default class Type extends Component {

    constructor(props){
        super(props);
        this.state          = {graphIndex:0};
        this.changeInnerTab = this.changeInnerTab.bind(this);
        this.download = this.download.bind(this);
        this.graphtabs      = [];

        for(var i in graphTypes){
            this.graphtabs.push(<Tab key={graphTypes[i]} label={graphTypes[i]} icon={graphIcons[i]}/>);
        }
        
    }

    download(){

        htmlToImage.toBlob(document.getElementById('dp-graphdiv'))
            .then(function (blob) {
            window.saveAs(blob, 'graph.png');
            });

        this.setState({});
    }

    changeInnerTab(event, newValue){
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
                
                <Topic topicIndex={this.props.topicIndex} graphIndex={this.state.graphIndex}/>
                <br />
                
                <div style={{width:"100%",textAlign:"right"}}>
                        <Button onClick={this.download} variant="contained" color="default" style={{marginRight:"30px",marginBottom:"20px"}}>
                            Download
                            <CloudDownloadIcon style={{marginLeft:"10px"}}/>
                        </Button>
                    </div>
            </div>
        );
    }
}