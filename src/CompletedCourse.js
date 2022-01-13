import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
class CompletedCourse extends Component {

    constructor(props) {
        super(props);
        this.setRating = this.setRating.bind(this);
        this.rating = React.createRef();
    }

    setRating() {

        if (!this.rating.current) {
            return;
        }
        this.props.updateRating(this.props.courseData.number, this.rating.current.value);
    }
    getCredits() {
        let courseData = this.props.courseData;
        if (!courseData) {
            return null;
        }
        let credits = courseData.credits;
        return (
            <span>{credits} Cr.</span>
        )
    }

    getRating() {
        let courseData = this.props.courseData;
        if (!courseData) {
            return null;
        }
        let rating = courseData.rating;
        if (rating == "No Rating") {
            return <span>No Rating</span>;
        }
        return (
            <span>Rating: {rating}</span>
        )
    }

    getRatingOptionLabel() {
        if (!this.rating.current) {
            return;
        }
        if (this.rating.current.value == "No Rating") {
            return <Form.Label>Rate this Course: </Form.Label>
        }
        else {
            return <Form.Label>Change Rating: </Form.Label>
        }
    }

    getRatingOptions() {
        let ratingOptions = [];
        for (const rating of this.props.ratings) {
            ratingOptions.push(<option key={rating}>{rating}</option>);
        }

        return ratingOptions;
    }
    render() {
        let courseData = this.props.courseData;
        if (!courseData) {
            return null;
        }
        let number = courseData.number;
        let name = courseData.name;
        let credits = this.getCredits();
        let rating = this.getRating();
        if (!number) {
            return null;
        }
        // return (
        //     <div className="CompletedCourse">
        //         {name} | {number}
        //     </div>
        // )
        return (
            <Card style={{ width: "66%", marginTop: "5px", marginBottom: "5px" }}>
                <Card.Body>
                    <Card.Title>
                        <div style={{ maxWidth: 500 }}>{name}</div>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {number} - {credits} - {rating}
                    </Card.Subtitle>
                    <Form>
                        <Form.Group controlId="formRatings">
                            {this.getRatingOptionLabel()}
                            <Form.Control
                                as="select"
                                ref={this.rating}
                                onChange={() => this.setRating()}
                                style={{ height: "125%" }}
                            >
                                {this.getRatingOptions()}
                            </Form.Control>
                        </Form.Group>
                    </Form>

                </Card.Body>
            </Card >
        )
    }
}

export default CompletedCourse;