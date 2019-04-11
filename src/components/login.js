import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { updateToken } from "../store";
import { Link } from 'react-router-dom';

import TextField from "@material-ui/core/TextField";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: ''
    }
  }

  // Handling all inputs
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  // Handling login form
  handleFormSubmit(e) {
    e.preventDefault();

    this.source = axios.CancelToken.source(); // Cancel active request

    const userData = {
      email: this.state.email,
      password: this.state.password
    }

    let API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

    axios.post(API_ROOT + "/auth", userData, { cancelToken: this.source.token })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          updateToken(response.data.token); // Token
          window.localStorage.setItem("token", response.data.token)  // Saving token in localStorage
          this.props.history.push("/todos");
          //this.setState({ message: "Login successfully" });
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          this.setState({ message: "Something went wrong !!!!" });
        }
      });

  }

  // Unmount mounted data
  componentWillUnmount() {
    if (this.source) {
      this.source.cancel();
    }
  }

  render() {
    //console.log(this.state);
    return (
      <div style={{ textAlign: 'center' }}>

        <Helmet>
          <title>Login</title>
        </Helmet><br />

        <div className="login__form">
          <form onSubmit={this.handleFormSubmit.bind(this)} noValidate autoComplete="off">
            <Card style={{ width: '300px' }} >
              <i className="material-icons accountman" style={{ fontSize: '100px' }}>account_circle</i>
              <CardHeader title="SIGN-IN" />
              <CardContent>
                <div className="message">{this.state.message}</div> {/* success/error messsage */}
                <Typography component="p">
                  <TextField
                    id="outlined-email-input"
                    label="Email" style={{ width: 250 }}
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange.bind(this)}
                  /> <br /><br />
                  <TextField style={{ width: 250, margin: 0 }}
                    id="outlined-email-input"
                    label="Password"
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange.bind(this)}
                  /><br/><br/>
                </Typography>
              </CardContent><br/><br/>
              <CardActions className="login__button">
                <Button style={{ width: '100%' }} type="submit" variant="contained" color="primary">LOGIN</Button>
              </CardActions>
              <p>Don't have an Account? <Button variant="outlined" color="primary"><Link to="/register">Register</Link></Button></p>
            </Card>
          </form>
        </div>

      </div>
    )
  }
}
