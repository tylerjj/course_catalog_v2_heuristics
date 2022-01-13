import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";

import "./App.css";
import Section from "./Section";

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
      showRequisitesModal: false,
      addFunc: () => { },
    };
    this.getMissingCourseRequisites = this.getMissingCourseRequisites.bind(this);
    this.missingRequisitesLaunchModal = this.missingRequisitesLaunchModal.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  render() {
    return (
      <Card style={{ width: "66%", marginTop: "5px", marginBottom: "5px" }
      }>
        <Card.Body className={this.inCart() ? 'bg-light' : 'bg-white'}>
          <Card.Title>
            <div style={{ maxWidth: 500 }}>{this.props.data.name}{this.inCart() ? <p className="ml-2">✅ (Added to Cart)</p> : ""}</div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number} - {this.getCredits()}
          </Card.Subtitle>
          {this.getDescription()}
          <Button variant="dark" onClick={() => this.openModal()}>
            View sections
          </Button>
        </Card.Body>
        <Modal
          show={this.state.showModal}
          onHide={() => this.closeModal()}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.getSections()}</Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showRequisitesModal}
          onHide={() => this.closeModal()}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Missing requisites for {this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.getMissingCourseRequisites()}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.state.addFunc()}>Add Anyway</Button>
            <Button variant="secondary" onClick={() => this.closeRequisiteModal()}>Back</Button>
          </Modal.Footer>
        </Modal>
      </Card >
    );
  }

  inCart() {
    if (this.props.courseKey in this.props.cartCourses) {
      if (!this.props.cartMode) {
        return true;
      }
    } else return false;
  }

  getCourseButton() {
    let buttonVariant = "dark";
    let buttonOnClick = () => this.addCourse();
    let buttonText = "Add Course";

    if (this.props.courseKey in this.props.cartCourses) {
      buttonVariant = "outline-dark";
      buttonOnClick = () => this.removeCourse();
      buttonText = "Remove Course";
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    );
  }

  getSections() {
    let sections = [];

    for (let i = 0; i < this.props.data.sections.length; i++) {
      sections.push(
        <Section
          key={this.props.data.number + i}
          data={this.props.data.sections[i]}
          addCartCourse={this.props.addCartCourse}
          removeCartCourse={this.props.removeCartCourse}
          cartCourses={this.props.cartCourses}
          courseKey={this.props.courseKey}
          sectionKey={i}
          missingRequisites={this.missingRequisitesLaunchModal}
        />
      );
    }

    return <Accordion defaultActiveKey="0">{sections}</Accordion>;
  }

  missingRequisitesLaunchModal(section, subsection) {
    let completedCourses = this.props.completedCourses;
    let requisites = this.props.data.requisites;
    let missingRequisites = [];
    for (let requisite of requisites) {
      let requisiteMet = false;
      for (let courseNumber of requisite) {
        for (let completedCourse of completedCourses) {
          if (courseNumber == completedCourse.number) {
            requisiteMet = true;
            break;
          }
        }
        if (requisiteMet) {
          break;
        }
      }
      if (!requisiteMet) {
        missingRequisites.push(requisite);
      }
    }
    if (missingRequisites.length > 0) {
      return this.openRequisiteModal(section, subsection);
    } else {
      return false;
    }
  }

  addCourse() {
    if (this.missingRequisitesLaunchModal() === false) {
      this.props.addCartCourse({
        course: this.props.courseKey,
      });
    }
  }

  addToCart() {
    this.closeRequisiteModal();
    // This is where we should check if 
    this.props.addCartCourse({
      course: this.props.courseKey,
    });
  }

  getMissingCourseRequisites() {
    let completedCourses = this.props.completedCourses;
    let requisites = this.props.data.requisites;
    let missingRequisites = [];
    for (let requisite of requisites) {
      let requisiteMet = false;
      for (let courseNumber of requisite) {
        if (!completedCourses) {
          break;
        }
        for (let completedCourse of completedCourses) {
          if (courseNumber == completedCourse.number) {
            requisiteMet = true;
            break;
          }
        }
        if (requisiteMet) {
          break;
        }
      }
      if (!requisiteMet) {
        missingRequisites.push(requisite);
      }
    }

    let missingRequisitesDisplay = [];

    console.log("Requisites: ");
    for (let requisite of missingRequisites) {
      console.log(requisite.toString());
      let reqString = "";
      if (requisite.length > 1) {
        for (let i = 0; i < requisite.length; i++) {
          reqString += requisite[i].toString();
          if (i + 1 != requisite.length) {
            reqString += " or ";
          }
        }
      } else {
        reqString = requisite[0].toString();
      }
      missingRequisitesDisplay.push(<li>{reqString}</li>);
    }

    return (
      <ul>{missingRequisitesDisplay}</ul>
    )
  }

  openRequisiteModal(section, subsection) {
    console.log("Opening Requisite Modal");
    console.log(section, subsection);
    if (!section && !subsection) {
      this.setState({
        showRequisitesModal: true, addFunc: () => {
          console.log("Adding Course");
          this.props.addCartCourse({
            course: this.props.courseKey,
          });
          this.closeRequisiteModal();
        }
      });
    }
    else if (section && !subsection) {
      this.setState({
        showRequisitesModal: true, addFunc: () => {
          console.log("Adding Section");
          this.props.addCartCourse({
            course: this.props.courseKey,
            section: section,
          });
          this.closeRequisiteModal();
        }
      });
    } else if (subsection) {
      this.setState({
        showRequisitesModal: true, addFunc: () => {
          console.log("Adding Subsection");
          this.props.addCartCourse({
            course: this.props.courseKey,
            section: section,
            subsection: subsection,
          });
          this.closeRequisiteModal();
        }
      });
    }

  }
  closeRequisiteModal() {
    this.setState({ showRequisitesModal: false });
  }
  removeCourse() {
    this.props.removeCartCourse({
      course: this.props.courseKey,
    });
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
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
      return <div>{this.props.data.description}</div>;
    }
  }

  getCredits() {
    // if (this.props.data.credits === 1) return "1 credit";
    // else return this.props.data.credits + " credits";
    return this.props.data.credits + " Cr.";
  }
}

export default Course;
