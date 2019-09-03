import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { Bar } from '@nivo/bar';
import {Row} from 'reactstrap';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';


// styling slider to make mark bigger
const styles = {
    mark :{
        width:"2px",
        height:"5px",
        backgroundColor:"blue"
    }
}
const StyledSlider = withStyles(styles)(Slider);


// custom bar component, label inside
const BarComponent = props => {
    var txt = null;

    // set color if grouped
    var _color = props.data.data._color;
    if(props.data.data._byIndex){
        _color = props.color
    }

    // if bar too small for text
    if(15*props.data.id.toString().length < props.width && 15*2 < props.height){
        txt= [<text
            key={props.data.data.id.toString()+props.data.id.toString()+"id"}
            x={props.width - 16}
            y={props.height / 2 - 8}
            textAnchor="end"
            dominantBaseline="central"
            fill="black"
            style={{
            fontWeight: 900,
            fontSize: 15,
            }}
        >
            {props.data.id}
        </text>,
        <text
            key={props.data.data.id.toString()+props.data.id.toString()+"val"}
            x={props.width - 16}
            y={props.height / 2 + 10}
            textAnchor="end"
            dominantBaseline="central"
            fill={"rgb(0,0,0)"}
            style={{
            fontWeight: 400,
            fontSize: 13,
            }}
        >
            {props.data.value}
        </text>]
    }
    return (
        <g transform={`translate(${props.x},${props.y})`}>
            <rect   x={-3} y={7} width={props.width} height={props.height} 
                    fill="rgba(0, 0, 0, .07)" />
            <rect   width={props.width} height={props.height} fill={_color} 
                    style={{strokeWidth:2, stroke:"rgb(0,0,0)"}} />
            <rect   x={props.width - 5} width={5} height={props.height} 
                    fill={"rgb(0,0,0)"} fillOpacity={0.2} />
            {txt}
        </g>
    );
};

const Sample = (props) => {

    const dataGenerator = props.data;
    var groupMode = "grouped";
    if(props.groupMode){
        groupMode = "stacked";
    }
    const [current, setCurrent] = useState([0,0]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if(current[1]){
                setCurrent([(current[0] + 1)%dataGenerator.length,current[1]]);
            }
        }, 1400);
        return () => clearTimeout(timer);
    }, [current, setCurrent]);

    if(current[0] >= props.data.length){
        current[0] = props.data.length-1;
    }

    var barData = [];
    if(props.ranking==="top"){
        barData = dataGenerator[current[0]][1].sort((a, b) => a._total-b._total);
    }else{
        barData = dataGenerator[current[0]][1].sort((a, b) => b._total-a._total);
    }
    var num = dataGenerator[current[0]][1].length-props.numberOfItems;
    if(num<0) num = 0;
    barData = barData.slice(num);

    return (
        <>
            <div id="dp-graphdiv" style={{width:"700px",height:"500px"}}>
                <Bar
                    barComponent={BarComponent}
                    width={700}
                    height={500}
                    data={barData}
                    keys={props.pkeys}
                    indexBy="id"
                    colorBy="id"
                    margin={{ top: 50, right: 60, bottom: 50, left: 80 }}
                    padding={0.3}
                    groupMode={groupMode}
                    layout="horizontal"
                    // colors={""}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: props.title,
                        legendPosition: 'middle',
                        legendOffset: 40
                    }}
                    enableGridX={false}
                    enableGridY={false}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                />
            </div>
        
            {/* ----------------------------------- Year ----------------------------------- */}
            <h2 style={{ marginLeft: 60, fontWeight: 400, color: '#555', textAlign:"center" }}>
                <strong style={{ color: 'black', fontWeight: 900 }}>{dataGenerator[current[0]][0]}</strong>
            </h2>

            {/* --------------------------  Player and Progress Bar-------------------------- */}
            <Row style={{margin:0, padding:0, alignItems:"center"}}>
                <Fab onClick={()=>{setCurrent([(current[0] - current[1]+1)%dataGenerator.length,1-current[1]])}}
                    size="medium" aria-label="Add" style={{marginLeft:50}}>
                    {[<PlayIcon />,<PauseIcon />][current[1]]}
                </Fab>
                
                <StyledSlider value={current[0]}
                        style={{width:550, marginLeft:30}}
                        aria-labelledby="discrete-slider"
                        step={1}
                        onChange={(event, newValue)=>{setCurrent([newValue,current[1]])}}
                        marks
                        min={0}
                        max={dataGenerator.length-1}/>
            </Row>
        </>
    );
};

export default Sample;