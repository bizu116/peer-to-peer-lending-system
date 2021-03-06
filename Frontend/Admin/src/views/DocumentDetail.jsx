import React from "react";

import { connect } from "react-redux";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Modal,
  CardFooter,
  Collapse,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";

import { css } from "@emotion/core";
import { PulseLoader, BeatLoader } from "react-spinners";
import Header from "components/Headers/Header.jsx";
import { database } from "../firebase";
import { apiLink } from "../api";
class DocumentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      isOpen: true,
      loading: true,
      //collapse
      collapse: false,
      accordion: [],
      timeout: 300
    };

    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.setSrcImgBase64 = this.setSrcImgBase64.bind(this);
    this.handleIDChange = this.handleIDChange.bind(this);

    this.validRedux = this.validRedux.bind(this);
  }

  async toggleAccordion(tab) {
    var arrAccordition = await this.fillArray(false, this.state.docs.length);
    await this.setState({
      accordion: arrAccordition
    });
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));

    this.setState({
      accordion: state
    });
  }

  async approveDocument(idDoc, username, docName) {
    this.toggleModal("defaultModal");
    this.setState({
      isOpen: true,
      loading: true
    });
    await fetch(apiLink + "/rest/admin/document/validDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        id: idDoc,
        documentId: this.state["idDocValidation-" + idDoc]
      })
    }).then(result => {
      // console.log(result);
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login");
      } else if (result.status === 200) {
        result.json().then(async data => {
          await database
            .ref("ppls")
            .orderByChild("username")
            .equalTo(username)
            .once("value", snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                this.setState({ keyUserFb: Object.keys(userData)[0] });
              }
            });
          await database
            .ref("/ppls/" + this.state.keyUserFb + "/notification")
            .push({
              message: "Your " + docName + " is approved !",
              sender: localStorage.getItem("user")
            });

          var upvotesRef = database.ref(
            "/ppls/" + this.state.keyUserFb + "/countNew"
          );
          await upvotesRef.transaction(function(current_value) {
            return (current_value || 0) + 1;
          });
          this.getUserDocument();
        });
      }
    });
  }

  async rejectDocument(idDoc, username, docName) {
    this.toggleModal("defaultModal");
    this.setState({
      isOpen: true,
      loading: true
    });
    await fetch(apiLink + "/rest/admin/document/invalidDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        id: idDoc
      })
    }).then(result => {
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login");
      } else if (result.status === 200) {
        result.json().then(async data => {
          await database
            .ref("ppls")
            .orderByChild("username")
            .equalTo(username)
            .once("value", snapshot => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                this.setState({ keyUserFb: Object.keys(userData)[0] });
              }
            });
          await database
            .ref("/ppls/" + this.state.keyUserFb + "/notification")
            .push({
              message: "Your " + docName + " is rejected !",
              sender: localStorage.getItem("user")
            });

          var upvotesRef = database.ref(
            "/ppls/" + this.state.keyUserFb + "/countNew"
          );
          upvotesRef.transaction(function(current_value) {
            return (current_value || 0) + 1;
          });
          this.getUserDocument();
        });
      }
    });
  }
  validRedux() {
    if (Object.keys(this.props.document.userInfo).length === 0) {
      this.props.history.push(localStorage.getItem("previousPage"));
      window.location.reload();
    }
  }
  setSrcImgBase64(type, image) {
    return "data:" + type + ";base64, " + image;
  }
  componentWillUpdate() {
    if (
      localStorage.getItem("isLoggedIn") == "" ||
      localStorage.getItem("isLoggedIn") == undefined
    ) {
      this.props.history.push("/login");
    } else {
      // this.getUserDocument();
    }
  }

  handleIDChange(event, idDoc) {
    this.setState({ ["idDocValidation-" + idDoc]: event.target.value });
  }
  async getUserDocument() {
    await fetch(
      apiLink +
        "/rest/admin/document/getAllUserDocument?username=" +
        this.props.document.userInfo.username,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      }
    ).then(result => {
      if (result.status === 401) {
        localStorage.removeItem("isLoggedIn");
        this.props.history.push("/login");
      } else if (result.status === 200) {
        result.json().then(data => {
          this.setState({
            docs: data,
            isOpen: false,
            loading: false
          });
        });
      }
    });
  }
  fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr.push(value);
    }
    return arr;
  }
  componentWillMount() {
    this.getUserDocument();
  }
  toggleModal = stateParam => {
    this.setState({
      [stateParam]: !this.state[stateParam]
    });
  };
  render() {
    const override = css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding-left: 0;
    `;
    const style = {
      profileComponent: {
        position: "relative",
        top: -250
      },
      myAccount: {
        position: "relative",
        top: -150
      },
      sameSizeWithParent: {
        width: "100%",
        height: "100%"
      }
    };

    return (
      <>
        {this.validRedux()}

        <Header />
        <Container className="mt--7" fluid>
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.isOpen}
            toggle={() => this.toggleModal("defaultModal")}
            style={style.sameSizeWithParent}
          >
            <div className="modal-header">
              <h3 className="modal-title" id="modal-title-default">
                Loading
              </h3>
            </div>
            <div className="modal-body">
              <PulseLoader
                css={override}
                sizeUnit={"px"}
                size={15}
                color={"#123abc"}
                loading={this.state.loading}
              />
            </div>
          </Modal>
          <Row>
            <Col className="order-xl-1" xl="10">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">
                        Profile :
                        {this.props.document.userInfo.firstName +
                          " " +
                          this.props.document.userInfo.lastName}
                      </h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <br />
                            <span className="description">
                              {this.props.document.userInfo.username}
                            </span>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Full Name
                            </label>
                            <br />
                            <span className="description">
                              {this.props.document.userInfo.firstName +
                                " " +
                                this.props.document.userInfo.lastName}
                            </span>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    <div id="accordion" style={{ width: "95%" }}>
                      {this.state.docs.map((docData, index) => (
                        <Card className="mb-0" key={index}>
                          <CardHeader id={"heading-" + index}>
                            <Button
                              block
                              color="link"
                              className="text-left m-0 p-0"
                              onClick={() => this.toggleAccordion(index)}
                              aria-expanded={this.state.accordion[index]}
                              aria-controls={"collapse-" + index}
                            >
                              <h5 className="m-0 p-0">
                                {docData.status == "valid" ? (
                                  <i
                                    className="ni ni-check-bold"
                                    style={{ color: "green" }}
                                  />
                                ) : docData.status == "pending" ? (
                                  <span
                                    style={{ width: "7.5%", float: "left" }}
                                  >
                                    <BeatLoader
                                      // css={override}
                                      sizeUnit={"px"}
                                      size={10}
                                      color={"#F00"}
                                      loading={this.state["loading" + index]}
                                    />
                                  </span>
                                ) : (
                                  <i
                                    className="ni ni-fat-remove"
                                    style={{ color: "red", fontSize: "15px" }}
                                  />
                                )}
                                {docData.documentType.name}
                              </h5>
                            </Button>
                          </CardHeader>

                          <Collapse
                            isOpen={this.state.accordion[index]}
                            data-parent="#accordion"
                            id={"collapse-" + index}
                            aria-labelledby={"heading-" + index}
                          >
                            <CardBody>
                              <Row>
                                {docData.documentFile.map(
                                  (imageData, indexImg) => (
                                    <Col
                                      lg="6"
                                      key={indexImg}
                                      style={style.sameSizeWithParent}
                                    >
                                      {imageData.fileType !== "video/webm" ? (
                                        <img
                                          src={this.setSrcImgBase64(
                                            imageData.fileType,
                                            imageData.data
                                          )}
                                          style={style.sameSizeWithParent}
                                        />
                                      ) : (
                                        <video
                                          width="320"
                                          height="240"
                                          controls
                                          src={this.setSrcImgBase64(
                                            imageData.fileType,
                                            imageData.data
                                          )}
                                        />
                                      )}
                                    </Col>
                                  )
                                )}
                              </Row>
                              {docData.status == "valid" ? (
                                ""
                              ) : (
                                <Row>
                                  <Col lg="4" />
                                  <Col lg="4">
                                    <Input
                                      placeholder="Validation ID Document"
                                      type="text"
                                      autoComplete="off"
                                      required
                                      value={
                                        this.state[
                                          "idDocValidation-" + docData.id
                                        ]
                                      }
                                      onChange={e =>
                                        this.handleIDChange(e, docData.id)
                                      }
                                    />
                                    <small style={{ color: "red" }}>
                                      <strong>
                                        {this.state.errorValidationDoc}
                                      </strong>
                                    </small>
                                  </Col>
                                  <Col lg="4">
                                    <FormGroup>
                                      <Button
                                        type="button"
                                        size="md"
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                          if (
                                            this.state[
                                              "idDocValidation-" + docData.id
                                            ] !== undefined &&
                                            this.state[
                                              "idDocValidation-" + docData.id
                                            ] !== ""
                                          ) {
                                            this.setState({
                                              errorValidationDoc: ""
                                            });
                                            this.toggleModal(
                                              "defaultModal-approve-" + index
                                            );
                                          } else {
                                            this.setState({
                                              errorValidationDoc:
                                                "Validation ID Document can not be blank !"
                                            });
                                          }
                                        }}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        type="button"
                                        size="md"
                                        className="btn btn-outline-danger"
                                        disabled={docData.status == "invalid"}
                                        onClick={() =>
                                          this.toggleModal(
                                            "defaultModal-reject-" + index
                                          )
                                        }
                                      >
                                        Reject
                                      </Button>
                                      {/* Approve MODAL */}
                                      <Modal
                                        className="modal-dialog-centered"
                                        isOpen={
                                          this.state[
                                            "defaultModal-approve-" + index
                                          ]
                                        }
                                        toggle={() =>
                                          this.toggleModal(
                                            "defaultModal-approve-" + index
                                          )
                                        }
                                      >
                                        <div className="modal-header">
                                          <h6
                                            className="modal-title"
                                            id="modal-title-default"
                                          >
                                            Approve document
                                          </h6>
                                          <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() =>
                                              this.toggleModal(
                                                "defaultModal-approve-" + index
                                              )
                                            }
                                          >
                                            <span aria-hidden={true}>×</span>
                                          </button>
                                        </div>
                                        <div className="modal-body">
                                          <p>
                                            Approve{" "}
                                            <strong>
                                              {docData.documentType.name}
                                            </strong>{" "}
                                            of{" "}
                                            <strong>
                                              {
                                                this.props.document.userInfo
                                                  .username
                                              }
                                            </strong>{" "}
                                            ?
                                          </p>
                                        </div>
                                        <div className="modal-footer">
                                          <Button
                                            color="primary"
                                            type="button"
                                            onClick={() => {
                                              this.approveDocument(
                                                docData.id,
                                                this.props.document.userInfo
                                                  .username,
                                                docData.documentType.name
                                              );
                                              this.toggleModal(
                                                "defaultModal-approve-" + index
                                              );
                                            }}
                                          >
                                            Yes
                                          </Button>
                                          <Button
                                            className="ml-auto"
                                            color="link"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() =>
                                              this.toggleModal(
                                                "defaultModal-approve-" + index
                                              )
                                            }
                                          >
                                            No
                                          </Button>
                                        </div>
                                      </Modal>
                                      {/* Approve MODAL */}
                                      {/* REJECT MODAL */}
                                      <Modal
                                        className="modal-dialog-centered"
                                        isOpen={
                                          this.state[
                                            "defaultModal-reject-" + index
                                          ]
                                        }
                                        toggle={() =>
                                          this.toggleModal(
                                            "defaultModal-reject-" + index
                                          )
                                        }
                                      >
                                        <div className="modal-header">
                                          <h6
                                            className="modal-title"
                                            id="modal-title-default"
                                          >
                                            Reject document
                                          </h6>
                                          <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() =>
                                              this.toggleModal(
                                                "defaultModal-reject-" + index
                                              )
                                            }
                                          >
                                            <span aria-hidden={true}>×</span>
                                          </button>
                                        </div>
                                        <div className="modal-body">
                                          <p>
                                            Reject{" "}
                                            <strong>
                                              {docData.documentType.name}
                                            </strong>{" "}
                                            of{" "}
                                            <strong>
                                              {
                                                this.props.document.userInfo
                                                  .username
                                              }
                                            </strong>{" "}
                                            ?
                                          </p>
                                        </div>
                                        <div className="modal-footer">
                                          <Button
                                            color="primary"
                                            type="button"
                                            onClick={() => {
                                              this.rejectDocument(
                                                docData.id,
                                                this.props.document.userInfo
                                                  .username,
                                                docData.documentType.name
                                              );
                                              this.toggleModal(
                                                "defaultModal-reject-" + index
                                              );
                                            }}
                                          >
                                            Yes
                                          </Button>
                                          <Button
                                            className="ml-auto"
                                            color="link"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() =>
                                              this.toggleModal(
                                                "defaultModal-reject-" + index
                                              )
                                            }
                                          >
                                            No
                                          </Button>
                                        </div>
                                      </Modal>
                                      {/* REJECT MODAL */}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              )}
                            </CardBody>
                          </Collapse>
                        </Card>
                      ))}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    document: state.document
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setDocument: userInfo => {
      dispatch({
        type: "SET_DETAIL_DOCUMENT_DATA",
        payload: userInfo
      });
    },
    setDocType: documentType => {
      dispatch({
        type: "SET_TYPE_DOCUMENT_DATA",
        payload: documentType
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentDetail);
