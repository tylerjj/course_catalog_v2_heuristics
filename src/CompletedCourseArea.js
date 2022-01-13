import React, { Component } from 'react'
import CompletedCourse from './CompletedCourse';

class CompletedCourseArea extends Component {

    getCourses() {
        let courses = this.props.courses;
        if (!courses) {
            return [];
        }
        let completedCourses = [];
        for (let i = 0; i < courses.length; i++) {
            completedCourses.push(
                <CompletedCourse
                    courseData={courses[i]}
                    ratings={this.props.ratings}
                    updateRating={this.props.updateRating}
                />
            )
        }
        return completedCourses;
    }

    render() {

        return (
            <div className="CompletedCourseArea" style={{ margin: 5 }}>
                <h1>Completed Courses</h1>
                <h4>View and rate completed courses.</h4>
                {this.getCourses()}
            </div>
        )
    }
}

export default CompletedCourseArea;