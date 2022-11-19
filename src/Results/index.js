import React from 'react';
import './css/Results.css';

class Results extends React.Component{
    constructor(props){
        super(props);
        this.responseTime = this.correctResponses = this.points = this.levelAchieved = null;
        if (this.props.score) {
            this.responseTime = this.props.score.responseTime ? this.props.score.responseTime : "--";
            this.correctResponses = this.props.score.correctResponses ? this.props.score.correctResponses : "--";
            this.points = this.props.score.points ? this.props.score.points : "--";
            this.levelAchieved = this.props.score.levelAchieved ? this.props.score.levelAchieved : "--";
        }
    }

    render(){
        return (
            <div className="container">
                <h2>Results</h2>
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1">Average reaction time</div>
                        <div className="col col-2">Percentage of correct answers</div>
                        <div className="col col-3">Average points</div>
                        <div className="col col-4">Current Level</div>
                    </li>
                    <li className="table-row">
                        <div className="col col-1">{this.responseTime}</div>
                        <div className="col col-2" >{this.correctResponses}</div>
                        <div className="col col-3" >{this.points}</div>
                        <div className="col col-4" >{this.levelAchieved}</div>
                    </li>
                </ul>
            </div>
            

        );
    }
}

export default Results;


/*<div className="tbl-header">
                <table>
                    <thead>
                        <tr align="center">
                            <th>Average reaction time</th>
                            <th>Percentage of correct answers</th>
                            <th>Average points</th>
                            <th>Current Level</th>
                        </tr>
                    </thead>
                    <tbody id='tr'>
                        <tr>
                            <td>{this.responseTime}</td>
                            <td>{this.correctResponses}</td>
                            <td>{this.points}</td>
                            <td>{this.levelAchieved}</td>
                        </tr>
                    </tbody>
                </table>
            </div>*/