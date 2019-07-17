import React,{Component} from 'react';
import { ResponsiveLine } from '@nivo/line';
// import {CustomLine} from './CustomLine';
import {Row,Col} from 'reactstrap';

export default class LineGraph extends Component {

    render(){
        var min='auto';
        if(this.props.area){
            min=0;
        }
    return(
        <ResponsiveLine
            data={this.props.data}
            margin={{ top: 50, right: 10, bottom: 50, left: 60 }}
            xScale={{ type: 'point', min: 'auto', max: 'auto' }}
            yScale={{ type: 'linear', stacked: this.props.stacked, min: min, max: 'auto' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'year',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: this.props.title,
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            curve={this.props.curve}
            enableSlices="x"
            colors={this.props.colors}
            pointSize={10}
            pointColor="#ffffff"
            enableArea={this.props.area}
            areaOpacity={0.7}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            sliceTooltip={({ slice }) => {
                if(this.props.stacked){
                    return (
                    <div
                        style={{
                        background: 'white',
                        padding: '9px 12px',
                        border: '1px solid #ccc',
                        }}
                    >
                        {slice.points.sort((a,b)=>b.data.yStacked-a.data.yStacked).map(point => (
                            <Row key={point.id} style={{margin:"0", alignItems:"center"}}>
                                <div style={{
                                    margin: "10px",
                                    width: "10px", height:"10px", 
                                    backgroundColor:point.serieColor}}></div>
                                <Col style={{minWidth:"300",maxWidth:"300"}}>{point.serieId}</Col>
                                <Col style={{minWidth:"30",maxWidth:"100", textAlign:"right"}}><strong>{point.data.yFormatted}</strong></Col>
                            </Row>
                        ))}
                    </div>)
                }
                return (
                    <div
                        style={{
                        background: 'white',
                        padding: '9px 12px',
                        border: '1px solid #ccc',
                        }}
                    >
                        {slice.points.sort((a,b)=>b.data.y-a.data.y).map(point => (
                            <Row key={point.id} style={{margin:"0", alignItems:"center"}}>
                                <div style={{
                                    margin: "10px",
                                    width: "10px", height:"10px", 
                                    backgroundColor:point.serieColor}}></div>
                                <Col style={{minWidth:"300",maxWidth:"300"}}>{point.serieId}</Col>
                                <Col style={{minWidth:"30",maxWidth:"100", textAlign:"right"}}><strong>{point.data.yFormatted}</strong></Col>
                            </Row>
                        ))}
                    </div>)
            }}
        />);
    }
}