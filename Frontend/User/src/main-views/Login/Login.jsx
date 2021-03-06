import React from 'react';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Button,
  Modal,
} from 'reactstrap';
// core components
import MainNavbar from '../MainNavbar/MainNavbar.jsx';
import SimpleFooter from 'components/Footers/SimpleFooter.jsx';

//api link
import {apiLink} from '../../api.jsx';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isForgotPassword: false,
      usernameForgotPassword: '',
      emailForgotPassword: '',
      validUsername: false,
      validEmail: false,
      isOpenError: false,
      message: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.changeIsForgotPassword = this.changeIsForgotPassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.handleUsernameForgotPassword = this.handleUsernameForgotPassword.bind(
      this
    );
    this.handleEmailForgotPassword = this.handleEmailForgotPassword.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleEmailForgotPassword(event) {
    const tmp = event.target.value.trim();
    if (tmp.match(/^[a-zA-Z0-9]{5,30}@[a-z]{3,10}(.[a-z]{2,3})+$/)) {
      document.getElementById('emailError').innerHTML = '';
      this.setState({
        emailForgotPassword: tmp,
        validEmail: true,
      });
    } else {
      document.getElementById('emailError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Email only contain alphabet character!</strong></div>";
      this.setState({
        emailForgotPassword: tmp,
        validEmail: false,
      });
    }
  }

  handleUsernameForgotPassword(event) {
    const tmp = event.target.value.trim();
    if (!tmp.match(/^\w*$/)) {
      document.getElementById('usernameError').innerHTML =
        "<div class='alert alert-danger' role='alert'><strong>Username does not contain special character!</strong></div>";
      this.setState({
        usernameForgotPassword: tmp,
        validUsername: false,
      });
    } else {
      document.getElementById('usernameError').innerHTML = '';
      this.setState({
        usernameForgotPassword: tmp,
        validUsername: true,
      });
    }
  }

  forgotPassword() {
    if (this.state.validEmail && this.state.validUsername) {
      var formData = new FormData();
      formData.append('username', this.state.usernameForgotPassword);
      formData.append('email', this.state.emailForgotPassword);

      fetch(apiLink + '/rest/user/forgotPassword', {
        method: 'POST',
        headers: {
          // "Content-Type": "application/json",
          // Authorization: localStorage.getItem("token")
        },
        body: formData,
      })
        .then(async result => {
          if (result.status === 200) {
            // this.changeIsChangePassword();
            // alert("Forgot Password");
            await this.setState({
              isOpenError: true,
              message: 'New Password send to your email.',
            });
          } else if (result.status === 401) {
            localStorage.removeItem('isLoggedIn');
            this.props.history.push('/login-page');
          } else if (result.status === 400) {
            // alert("email or username is not exist");
            await this.setState({
              isOpenError: true,
              message: 'email or username is not exist',
            });
          }
        })
        .catch(async data => {
          //CANNOT ACCESS TO SERVER
          await this.handleError(data);
        });
    }
    // }
  }
  async handleError(data) {
    if (data.toString() === 'TypeError: Failed to fetch') {
      await this.setState({
        isOpenError: true,
        message: 'Cannot access to server',
      });
    } else {
      await this.setState({
        isOpenError: true,
        message: data,
      });
    }
  }
  changeIsForgotPassword() {
    this.setState({
      isForgotPassword: !this.state.isForgotPassword,
    });
  }

  getUsername() {
    fetch(apiLink + '/rest/user/getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
        // "Authorization": this.props.tokenReducer.token
        // 'Access-Control-Allow-Origin': '*'
      },
    })
      .then(result => {
        if (result.status === 200) {
          result.json().then(data => {
            localStorage.setItem(
              'profile',
              data.firstName + ' ' + data.lastName
            );
          });
        } else if (result.status === 401) {
          localStorage.removeItem('isLoggedIn');
          this.props.history.push('/login-page');
        }
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
  }

  handleNameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  // setToken(token) {
  //   this.props.setToken(token);
  // }

  handleSubmit() {
    fetch(apiLink + '/rest/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(result => {
        result.json().then(data => {
          if (result.status === 200) {
            if (data.role === 'ROLE_USER') {
              localStorage.setItem('token', data.token);
              localStorage.setItem('isLoggedIn', true);
              localStorage.setItem('user', data.username);
              this.getUsername();
              this.props.history.push('/profile-page');
            } else {
              document.getElementById('loginError').innerHTML =
                "<div class='alert alert-danger' role='alert'><strong>Your account is not user account</strong><br/> Please try again!</div>";
            }
          }
          if (result.status === 400) {
            // event.preventDefault();
            if (data.message === 'Wrong userId and password')
              document.getElementById('loginError').innerHTML =
                "<div class='alert alert-danger' role='alert'><strong>Username or password is incorrect!</strong><br/> Please try again!</div>";
          }
        });
      })
      .catch(async data => {
        //CANNOT ACCESS TO SERVER
        await this.handleError(data);
      });
    // event.preventDefault();
    // this.props.history.push('/')
  }

  componentWillMount() {
    //isLoggedIn = true go back to homepage (prevent go to login page when isLoggedIn = true)
    if (
      localStorage.getItem('isLoggedIn') !== null &&
      localStorage.getItem('token') !== null
    ) {
      this.props.history.push('/');
    } else {
      // localStorage.removeItem("token");
      localStorage.removeItem('isLoggedIn');
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  render() {
    return (
      <>
        <MainNavbar />
        <main ref="main">
          <section className="section section-shaped section-lg bg-gradient-info">
            {/* <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div> */}
            <Container className="pt-lg-md">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-1">
                      <p className="text-center text-muted mb-4">
                        Peer-to-Peer Lending System
                      </p>
                    </CardHeader>
                    <CardBody className="">
                      <div className="text-center text-muted">
                        {this.state.isForgotPassword === false ? (
                          <p>Sign in here</p>
                        ) : (
                          <p>
                            Input Username and Email for recover your password
                          </p>
                        )}
                      </div>
                      <Form>
                        {/* role="form" */}
                        {/* onSubmit={this.handleSubmit} */}
                        {this.state.isForgotPassword === false ? (
                          <div>
                            <FormGroup className="mb-3">
                              <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="ni ni-email-83" />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  placeholder="Username"
                                  type="text"
                                  value={this.state.username}
                                  onChange={this.handleNameChange}
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="ni ni-lock-circle-open" />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  placeholder="Password"
                                  type="password"
                                  autoComplete="off"
                                  value={this.state.password}
                                  onChange={this.handlePasswordChange}
                                />
                              </InputGroup>
                            </FormGroup>
                            <div>
                              <p style={{color: 'red'}} id="loginError" />
                            </div>
                            <div className="text-center my-4">
                              {/* type="submit"  */}
                              <Button
                                size="md"
                                outline
                                color="primary"
                                onClick={() => this.handleSubmit()}
                              >
                                Sign In
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <FormGroup>
                              <Input
                                placeholder="Username"
                                type="text"
                                autoComplete="off"
                                value={this.state.usernameForgotPassword}
                                onChange={this.handleUsernameForgotPassword}
                              />
                              <p id="usernameError" />
                            </FormGroup>
                            <FormGroup>
                              <Input
                                placeholder="Email"
                                type="email"
                                autoComplete="off"
                                value={this.state.emailForgotPassword}
                                onChange={this.handleEmailForgotPassword}
                              />
                              <p id="emailError" />
                            </FormGroup>
                            <div className="text-center my-4">
                              <Button
                                size="md"
                                outline
                                color="primary"
                                onClick={() => this.forgotPassword()}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        )}
                      </Form>
                    </CardBody>
                  </Card>
                  {this.state.isForgotPassword === false ? (
                    <Row className="mt-3">
                      <Col xs="6">
                        <p
                          className="text-white"
                          style={{cursor: 'pointer'}}
                          // href="#pablo"
                          onClick={() => this.changeIsForgotPassword()}
                        >
                          <small>Forgot password?</small>
                        </p>
                      </Col>
                      <Col className="text-right" xs="6">
                        <a className="text-white" href="/register-page">
                          <small>Create new account</small>
                        </a>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.isOpenError}
          // toggle={() => this.toggleModal('defaultModal')}
        >
          <div className="modal-header">Notify</div>
          <div className="modal-body">
            <h3 className="modal-title" id="modal-title-default">
              {this.state.message}
            </h3>
          </div>
          <div className="modal-footer">
            <Button
              onClick={() => {
                this.setState({isOpenError: false});
              }}
            >
              OK
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default Login;
