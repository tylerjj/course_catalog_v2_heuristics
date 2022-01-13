import React from "react";
import "./App.css";
import Course from "./Course";

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (!this.props.cartMode) {
      courses.push(
        <>
          <h1>Course Selection</h1>
          <h4>View courses, or add/remove them from your cart.</h4>
        </>
      );
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <Course
            key={"course_" + i}
            data={this.props.data[i]}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
            completedCourses={this.props.completedCourses}
            cartMode={this.props.cartMode}
          />
        );
      }
    } else {
      courses.push(
        <>
          <h1>Course Cart</h1>
          <h4>Add or remove courses from your cart.</h4>
        </>
      );
      for (let i = 0; i < this.props.data.length; i++) {

        courses.push(
          <Course
            key={"cartItem_" + this.props.data[i].number}
            data={this.props.data[i]}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
            completedCourses={this.props.completedCourses}
            cartMode={this.props.cartMode}
          />
        );
      }
      if (courses.length === 1) {
        courses.push(
          <div>
            <h6 style={{ margin: "20px 20px" }}>Cart is empty.</h6>
          </div >
        )
      }
    }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    return (
      <div style={{ margin: 5 }}>
        <div>{this.getCourses()}</div>
      </div>
    );

  }
}

export default CourseArea;
