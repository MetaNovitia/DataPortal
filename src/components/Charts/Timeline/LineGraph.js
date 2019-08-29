import React,{Component} from 'react';
import { ResponsiveLine } from '@nivo/line';
import {Row,Col} from 'reactstrap';

export default class LineGraph extends Component {

    render(){

        // set if area shown
        var min='auto';
        if(this.props.area){min=0;}

        return(
            <>
                <div >
                    <div id="dp-graphdiv" style={{height:"600px", width:"100%"}}>
                        <ResponsiveLine
                            data={this.props.data}
                            margin={{ top: 50, right: 25, bottom: 50, left: 80 }}
                            xScale={{ type: 'point', min: 'auto', max: 'auto' }}
                            yScale={{ type: 'linear', stacked: this.props.stacked, min: min, max: 'auto' }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -55,
                                legend: 'year',
                                legendOffset: 40,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 4,
                                tickPadding: 2,
                                tickRotation: 0,
                                legend: this.props.title,
                                legendOffset: -70,
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
                                // custom tooltip for stacked and not stacked
                                return (
                                <div
                                    style={{
                                    background: 'white',
                                    padding: '9px 12px',
                                    border: '1px solid #ccc',
                                    }}
                                >
                                    {slice.points.sort((a,b)=>{
                                        if(b.data.hasOwnProperty("yStacked")){
                                            return b.data.yStacked-a.data.yStacked;
                                        }
                                        return b.data.y-a.data.y;
                                    }).map(point => (
                                        <Row key={point.id} style={{margin:"0", alignItems:"center"}}>
                                            {/* color mark box on the left */}
                                            <div style={{
                                                margin: "10px",
                                                width: "10px", height:"10px", 
                                                backgroundColor:point.serieColor}}></div>

                                            {/* line name */}
                                            <Col style={{minWidth:"300",maxWidth:"300"}}>{point.serieId}</Col>

                                            {/* point value */}
                                            <Col style={{minWidth:"30",maxWidth:"100", textAlign:"right"}}>
                                                <strong>{point.data.yFormatted}</strong>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>)
                            }}
                        />
                    </div>
                </ div>
            </>
            );
    }
}