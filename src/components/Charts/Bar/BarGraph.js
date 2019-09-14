import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import { Bar } from '@nivo/bar';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { withStyles } from '@material-ui/core/styles';
import lighten from '../../../lighten';


const styles = theme => ({
    chartContainer: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: "white",

        padding: 0,
        margin: 0,
    },
    gridContainer: {
        paddingBottom: "10px",
        alignItems:"center",
        justifyItems:"center",
        textAlign:"center"
    },
    formControl: {
        width: "100%",
        marginTop: "10px",
    },
    select: {
        height: "40px"
    }
});

const stylesM = {
    mark :{
        width:"2px",
        height:"5px",
        backgroundColor:"blue"
    }
}

const StyledSlider = withStyles(stylesM)(Slider);


// custom bar component, label inside
const BarComponent = props => {
    var txt = null;

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

    const LightTooltip = withStyles(theme => ({
        tooltip: {
          backgroundColor: lighten(props.color),
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 11,
        },
      }))(Tooltip);

    return (
        <LightTooltip TransitionComponent={Zoom} title={
            <React.Fragment >
                <Grid container direction="row" 
                    style={{
                            marginTop:"5px",marginBottom:"5px", 
                            font:"bold 12px Courier", whiteSpace:"nowrap"}}>
                    {props.data.id} - {props.data.value}
                </Grid>
            </React.Fragment>
        } placement="right">
            <g transform={`translate(${props.x},${props.y})`}>
                <rect   x={-3} y={7} width={props.width} height={props.height} 
                        fill="rgba(0, 0, 0, .07)" />
                <rect   width={props.width} height={props.height} fill={props.color} 
                        style={{strokeWidth:2, stroke:"rgb(0,0,0)"}} />
                <rect   x={props.width - 5} width={5} height={props.height} 
                        fill={"rgb(0,0,0)"} fillOpacity={0.2} />
                {txt}
            </g>
        </LightTooltip>
    );
};

const BarGraph = (props) => {

    const classes = props.classes;

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

    if(props.data.length===0){
        current[0] = 0;
        return null;
    } 
    
    if(current[0] >= props.data.length){
        current[0] = props.data.length-1;
    }

    var barData = [];

    if(props.ranking==="top"){
        barData = dataGenerator[current[0]][1].sort((a, b) => a._total-b._total);
    }else{
        barData = dataGenerator[current[0]][1].sort((a, b) => b._total-a._total);
    }
    barData = barData.slice(dataGenerator[current[0]][1].length-props.numberOfItems);

    
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
                    colors={props.colors}
                    borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: props.title,
                        legendPosition: 'middle',
                        legendOffset: 32
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
            <Grid container direction="row" justify="center" alignItems="center" className={classes.chartContainer}>
                <Grid item xs={2} className={classes.gridContainer}>
                    <Fab onClick={()=>{setCurrent([(current[0] - current[1]+1)%dataGenerator.length,1-current[1]])}}
                        size="medium" aria-label="Add">
                        {[<PlayIcon />,<PauseIcon />][current[1]]}
                    </Fab>
                </Grid>
                
                <Grid item xs={9} className={classes.gridContainer}>
                    <StyledSlider value={current[0]}
                            style={{width:"100%"}}
                            aria-labelledby="discrete-slider"
                            step={1}
                            onChange={(event, newValue)=>{setCurrent([newValue,current[1]])}}
                            marks
                            min={0}
                            max={dataGenerator.length-1}/>
                </Grid>
            </Grid>
        </>
    );
};

export default withStyles(styles)(BarGraph);