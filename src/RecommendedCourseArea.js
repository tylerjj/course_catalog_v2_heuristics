import React, { Component } from 'react'
import RecommendedCourse from './RecommendedCourse';

class RecommendedCourseArea extends Component {

    constructor(props) {
        super(props);
    }

    // Create empty array of recommended courses
    // Iterate through allCourses
    //  let myCourse =
    // if course is not completed
    //      

    getRecommendedCourses() {
        let allCourses = this.props.allCourses;
        let completedCourses = this.props.completedCourses;

        let recommendedCourses = [];
        for (let i = 0; i < allCourses.length; i++) {
            let course = allCourses[i];
            let recommendedCourse = {
                name: course.name,
                number: course.number,
                description: course.description,
                credits: course.credits,
                keywords: course.keywords,
                requisites: course.requisites,
                sections: course.sections,
                recommenders: [],
            }


            for (let completedCourse of completedCourses) {
                if (course.number == completedCourse.number) {
                    break;
                }
                else if (completedCourse.rating >= 3) {
                    let recommender = {
                        course: completedCourse,
                        keywords: [],
                    }
                    for (let keyword of completedCourse.keywords) {
                        if (course.keywords.includes(keyword)) {
                            recommender.keywords.push(keyword);
                        }
                    }
                    if (recommender.keywords.length > 0) {
                        recommendedCourse.recommenders.push(recommender);
                    }
                }
            }
            if (recommendedCourse.recommenders.length > 0) {
                recommendedCourses.push(recommendedCourse);
            }
        }
        return recommendedCourses;
    }


    getRecommendations() {
        let recommendedCourses = this.getRecommendedCourses();
        if (!recommendedCourses) {
            return null;
        }

        let recommendations = [];
        for (let recommendedCourse of recommendedCourses) {
            let recommendation = <RecommendedCourse course={recommendedCourse} />
            recommendations.push(recommendation);
        }
        if (recommendations.length < 1) {
            recommendations.push(
                <h6 style={{ margin: "20px 20px" }}>No recommended courses. Try rating your completed courses in order for recommendations to be generated.</h6>
            )
        }
        return recommendations;
    }

    render() {
        return (
            <div className="RecommendedCourseArea" style={{ margin: 5 }}>
                <h1>Recommended Courses</h1>
                <h4>View recommended courses:</h4>
                <h5 className="text-muted">Courses in which you meet the pre-requisites, and which share interests with past courses you've rated highly.</h5>
                {this.getRecommendations()}
            </div>
        )
    }
}

export default RecommendedCourseArea;