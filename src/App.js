import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import CompletedCourseArea from "./CompletedCourseArea";
import RecommendedCourseArea from "./RecommendedCourseArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const HOST = {
  WEB: "https://cs571.cs.wisc.edu/api/react/",
  LOCAL: "http://localhost:5000/api/react/"
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      interests: [],
      cartCourses: {},
      completedCourses: [],
      ratings: [],
      recommendedCourses: [],
    };

    this.updateRating = this.updateRating.bind(this);
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    //let courseURL = "http://cs571.cs.wisc.edu:53706/api/react/classes";
    let courseURL = HOST.WEB + "classes";
    let courseData = await (await fetch(courseURL)).json();

    //let completedCourseURL = "http://cs571.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completedCourseURL = HOST.WEB + "students/5022025924/classes/completed/";
    let completedCourseData = await (await fetch(completedCourseURL)).json();
    this.setState({
      allCourses: courseData,
      filteredCourses: courseData,
      subjects: this.getSubjects(courseData),
      interests: this.getInterests(courseData),
      completedCourses: this.getCompletedCourses(courseData, completedCourseData.data),
      ratings: this.getRatings(),
    });
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getInterests(data) {
    let interests = [];
    interests.push("All");

    for (let i = 0; i < data.length; i++) {
      let keywords = data[i].keywords;
      for (let j = 0; j < keywords.length; j++) {
        if (!interests.includes(keywords[j])) {
          interests.push(keywords[j]);
        }
      }
    }

    return interests;
  }

  getRatings() {
    let ratings = [];
    ratings.push("No Rating");

    for (let i = 1; i <= 5; i++) {
      ratings.push(i.toString());
    }
    return ratings;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  getCompletedCourses(courses, numbers) {
    let completedCourses = [];
    for (let course of courses) {
      for (let number of numbers) {
        if (course.number == number) {
          let thisCourse = {
            name: course.name,
            number: course.number,
            credits: course.credits,
            description: course.description,
            subject: course.subject,
            keywords: course.keywords,
            sections: course.sections,
            rating: "No Rating",
          }
          completedCourses.push(thisCourse);
          break;
        }
      }
    }
    return completedCourses;
  }

  updateRating(number, score) {
    let courses = this.state.completedCourses;
    for (let i = 0; i < courses.length; i++) {
      let course = courses[i];
      if (course.number == number) {
        courses[i].rating = score;
      }
    }
    this.setState({ completedCourses: courses });
    console.log("Rating Updated");
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].forEach((_subsection) => {
        if (_subsection.number === data.subsection.number) {
          newCartCourses[data.course][data.section].splice(
            newCartCourses[data.course][data.section].indexOf(_subsection),
            1
          );
        }
      });
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  render() {
    return (
      <>
        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="select" title="Course Selection" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              interests={this.state.interests}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                cartMode={false}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                completedCourses={this.state.completedCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <CompletedCourseArea
                courses={this.state.completedCourses}
                ratings={this.state.ratings}
                updateRating={this.updateRating}
              />
            </div>
          </Tab>
          <Tab eventKey="recommended" title="Recommended Courses" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <RecommendedCourseArea
                allCourses={this.state.allCourses}
                completedCourses={this.state.completedCourses}
                interests={this.state.interests}
              />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.getCartData()}
                cartMode={true}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
