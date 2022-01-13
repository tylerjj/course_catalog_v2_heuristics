import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';
class RecommendedCourse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }
    getRecommenderDisplay(recommenders) {
        if (!recommenders) {
            return null;
        }

        let recommenderDisplay = [];
        for (let i = 0; i < recommenders.length; i++) {
            let keywordDisplay = [];
            for (let keyword of recommenders[i].keywords) {
                keywordDisplay.push(
                    <li>{keyword}</li>
                );
            }
            recommenderDisplay.push(
                <div>
                    {recommenders[i].course.number} | Matching Interests:
                    <ul>
                        {keywordDisplay}
                    </ul>
                </div>
            );
        }
        return recommenderDisplay;
    }

    setExpanded(value) {
        this.setState({ expanded: value });
    }

    getExpansionButton() {
        let buttonText = "▼";
        let buttonOnClick = () => this.setExpanded(true);

        if (this.state.expanded) {
            buttonText = "▲";
            buttonOnClick = () => this.setExpanded(false);
        }

        return (
            <Button
                variant="outline-dark"
                style={{
                    width: 25,
                    height: 25,
                    fontSize: 12,
                    padding: 0,
                    position: "absolute",
                    right: 20,
                    top: 20,
                }}
                onClick={buttonOnClick}
            >
                {buttonText}
            </Button>
        );
    }

    getDescription() {
        if (this.state.expanded) {
            return <div>{this.props.course.description}</div>;
        }
    }

    render() {

        let course = this.props.course;
        let recommenders = course.recommenders;
        let name = course.name;
        let number = course.number;
        let credits = course.credits;
        let description = course.description;

        return (
            <div className="RecommendedCourse">
                <Card style={{ width: "66%", marginTop: "5px", marginBottom: "5px" }}>
                    <Card.Body>
                        <Card.Title>
                            <div style={{ maxWidth: 500 }}>{name}</div>
                            {this.getExpansionButton()}
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {number} - {credits} Cr.
                        </Card.Subtitle>
                        <Card.Subtitle className="mb-4">
                            {this.getDescription()}
                        </Card.Subtitle>
                        <Card.Subtitle className="mb-2 ">
                            <p className="fw-bold">Because you liked:</p>
                            {this.getRecommenderDisplay(recommenders)}
                        </Card.Subtitle>
                    </Card.Body>
                </Card>

            </div>
        )
    }
}

export default RecommendedCourse;