import React from 'react';
import CONSTANTS from './Constants';
import Results from "../Results";
import {formatNumber, getRndInteger, getTimeNow} from "../utils/utils";

function Circles(props) {
    let circles = [];
    let numberCirclesByRow = props.numberCirclesByRow;
    let totalCircles = Math.pow(numberCirclesByRow,2);
    let circleDiameter = 90 - numberCirclesByRow * 4;

    for(let i=0, j=totalCircles; i < totalCircles; i++){
        if(i % numberCirclesByRow===0){
            circles.push(<br key={++j} />)
        }
        circles.push(<Circle index={i} key={i} clickHendler={props.clickHendler} circleDiameter={circleDiameter} />)
    }

    return circles.map((val)=>{return val;});
}

function Circle(props) {
    let circleDiameter = props.circleDiameter;
    const style = {
        width: circleDiameter,
        height: circleDiameter,
        margin: circleDiameter*0.05,
        borderRadius: '100%',
        backgroundColor : CONSTANTS.CIRCLE_NOT_SELECTED_COLOR,
        border:'0px'
    };

    return (
        <input id={props.index} type="button" onClick={props.clickHendler}  style={style} />
    )
}



function ControlButtons(props) {
    const buttonStyle = {
        backgroundColor: "#008CBA",
        border: "none",
        color: "white",
        padding: "15px 32px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        margin: "4px 2px",
        cursor: "pointer"
    };

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        margin: "20px auto"
    };

    return (<div style={containerStyle}>
            <input type="button" style={buttonStyle} onClick={props.onPlay} value={props.playButtonText} />
            <input type="button" style={buttonStyle} onClick={props.onFinish} value="DONE" />
        </div>
    )
}

class MemoryTrack extends React.Component {

    constructor(props){
        super(props);
        this.currentLevel = 1;
        this.state={
            selected:[],
            propose:[],
            attempts: [],
            durationToShowCircles:3000,
            firstDuration: 0,
            responseTime:0,
            isFinish:false,
            scorePath: null,
            isNomberCirclesByRowUpdated: false,
            numberCirclesByRow: 3,
            isPreparationFinish: false,
            GameFinish:false
        };
        this.playButtonText = "PLAY";
        this.isClicked=true;
        this.clickHendler=this.clickHendler.bind(this);
        this.onPlay=this.onPlay.bind(this);
        this.finish=this.finish.bind(this);
    }


    componentWillMount(){
        this.setState({
            firstDuration: getTimeNow()
        })
    }

    finish(){
        this.setState({GameFinish:true, isFinish: true, selected: [],isPreparationFinish: false, numberCirclesByRow: 3});
        this.playButtonText = "PLAY"
    }

    onPlay() {
        this.currentLevel = (this.playButtonText === "PLAY" ) ? 1 : this.currentLevel;
        setTimeout(()=>{
            this.setState(
                {GameFinish: false, isFinish: false},
                () => {
                    this.suggestedCircles(this.state.numberCirclesByRow);
                });
        },400);
        this.playButtonText = "TRY AGAIN"
    }


    /**
     * add new attempt to the attempts array
     *
     * isResponseRight represent if the level exceeds successfully or not
     *
     * @param state
     * @param isResponseRight
     */
    setComponentState(state , isResponseRight){
        let color=(isResponseRight) ? CONSTANTS.CORRECT_ANSWER_COLOR : CONSTANTS.WRONG_ANSWER_COLOR;
        this.state.attempts.push({
            responseTime: getTimeNow() - this.state.firstDuration,
            correctResponses: (isResponseRight)?<i className="icon-checkmark3 text-success"></i>:<i className="icon-cross2 text-danger-400"></i>,
            points: (isResponseRight)?1000:0 ,
            levelAchieved: this.currentLevel
        });
        document.getElementById(this.state.selected[this.state.selected.length-1]).style.backgroundColor=color;

        setTimeout(()=>{
            this.state.selected.forEach((val) => {
                document.getElementById(val).style.backgroundColor = CONSTANTS.CIRCLE_NOT_SELECTED_COLOR;
            });
            state.firstDuration=getTimeNow();
            this.setState(
                state,
                () => {
                    this.suggestedCircles(this.state.numberCirclesByRow);
                });
        },400)
    }

    /**
     * this method handle the buttons click
     *
     * @param event
     */
    clickHendler(event) {
        if(this.state.isPreparationFinish){

        let btnClicked = event.target.id;
        let numberCirclesByRow=this.state.numberCirclesByRow;
        let numberCirclesPossible = (this.state.isNomberCirclesByRowUpdated)?numberCirclesByRow:numberCirclesByRow-1;

            if(this.state.selected.length < numberCirclesPossible) {
                if (this.state.selected[this.state.selected.length-1]==btnClicked) {
                    document.getElementById(btnClicked).style.backgroundColor = CONSTANTS.CIRCLE_NOT_SELECTED_COLOR;
                    let index = this.state.selected.indexOf(btnClicked);
                    if (index > -1) {
                        this.state.selected.splice(index, 1);
                    }
                }else {
                    this.state.selected.push(btnClicked);
                    document.getElementById(btnClicked).style.backgroundColor =CONSTANTS.SELECTED_CIRCLE_COLOR;
                }
            }

            if(this.state.selected.length === numberCirclesPossible && this.isClicked){
                this.isClicked=false;
                for(let i=0;i<numberCirclesPossible;i++){
                    if(+this.state.selected[i]!== +this.state.propose[i]){
                        this.setComponentState({selected: [],isPreparationFinish: false},false);
                        return;
                    }
                }
                this.currentLevel+=1;
                this.setComponentState({
                    numberCirclesByRow: (!this.state.isNomberCirclesByRowUpdated)?numberCirclesByRow:numberCirclesByRow+1,
                    isNomberCirclesByRowUpdated: !this.state.isNomberCirclesByRowUpdated,
                    selected: [],
                    isPreparationFinish: false
                },true);
            }
        }
    };

    /**
     * this method generate a random Circles positions accepting (param 1) number of Circles to generate
     * and return array contain positions
     *
     * @param numberCirclesByRow
     * @returns {Array}
     */
    generateRandomCircls(numberCirclesByRow){
        console.log("generateRandomCircls()");

        let btnsGenerate=[];
        let numberCirclesByRows = numberCirclesByRow;
        let isNomberCirclesByRowUpdated = this.state.isNomberCirclesByRowUpdated;
        let maxnumberCirclesByRows = Math.pow(numberCirclesByRows,2);
        let item;
        let size = (isNomberCirclesByRowUpdated) ? numberCirclesByRows : numberCirclesByRows-1;
        for(let i=0;i<size;i++){
            item = getRndInteger(0,maxnumberCirclesByRows);
            if(!btnsGenerate.includes(item)){
                btnsGenerate.push(item);
            }else{
                size++;
            }
        }
        this.setState({
            propose: btnsGenerate
        },() => {
            console.log('number of circles  '+ this.state.propose.length);
        });
        return btnsGenerate;
    }

    /**
     * prepared the circle to be presented
     *
     * @param numberCirclesByRow
     */
    suggestedCircles(numberCirclesByRow){
        console.log("suggestedCircles");

        if(this.state.GameFinish){
            this.setState(
                {isFinish: true},
                ()=>{console.log('isfinished '+this.state.isFinish)}
            );
            return clearInterval(this.timerID);
        }

        let isFinish = this.state.isFinish;
        let durationToShowCircle=this.state.durationToShowCircles/numberCirclesByRow;
        if(!isFinish){
            let Circles = this.generateRandomCircls(numberCirclesByRow);
            Circles.forEach((val,index,map) => {
                let ele = document.getElementById(val);
                if(ele){
                    setTimeout(function(){
                        ele.style.backgroundColor = CONSTANTS.SELECTED_CIRCLE_COLOR;
                    },durationToShowCircle*index);
                    setTimeout(()=> {
                            ele.style.backgroundColor  = CONSTANTS.CIRCLE_NOT_SELECTED_COLOR;
                        }
                        ,durationToShowCircle*Circles.length);
                }
            });
            setTimeout(()=>{
                this.isClicked=true;
                this.setState({
                        firstDuration: +new Date(),
                        isPreparationFinish: true
                    },()=>{
                });
            },durationToShowCircle*Circles.length);

        }
    }

    score(){
        if (this.state.isFinish && this.state.attempts.length > 0) {
            let sommeResponseTime = 0, sommePoints = 0, sommeCorrectResponse = 0;
            this.state.attempts.forEach(function (elem) {
                sommeResponseTime += elem.responseTime;
                sommePoints += elem.points;
                if("icon-checkmark3 text-success" === elem.correctResponses.props.className) sommeCorrectResponse++;
            });
            let score = {
                responseTime :  formatNumber((sommeResponseTime / this.state.attempts.length)/1000).toFixed(3)+" sec."  ,
                correctResponses:  formatNumber((sommeCorrectResponse / this.state.attempts.length)*100)+'%',
                points:  sommePoints,
                levelAchieved: this.currentLevel,
                attempts: this.state.attempts
            };
            return score;
        }
        return false;
    }


    render() {
        let status = !this.state.isFinish;
        let numberCirclesByRow = this.state.numberCirclesByRow;
        let marginCircle = window.innerHeight/2-numberCirclesByRow*(90-numberCirclesByRow*4)/2-110;
        return(
            <div>
                {
                    status?
                        <div style={{width:'100%',marginTop: marginCircle,textAlign: 'center'}}>
                            <h3> Level {this.currentLevel}</h3>
                            <Circles numberCirclesByRow={numberCirclesByRow} clickHendler={this.clickHendler} />
                        </div>
                        :
                        <Results score={this.score()} />
                }

                <ControlButtons onPlay={this.onPlay} onFinish={this.finish} playButtonText={this.playButtonText}/>
            </div>
        )
    }
}



export default MemoryTrack;
