import React from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

import GoogleLogin from 'react-google-login';

dotenv.config();
const baseURL = process.env.REACT_APP_BASEURL || 'http://localhost:5000';

class Login extends React.Component {
  componentDidMount() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      window.history.back();
    }
  }

  successGoogleLogin(response) {
    const user = {
      username: response.profileObj.name,
      socialId: response.googleId,
    };

    axios
      .post(`${baseURL}/auth/login`, user)
      .then((res) => {
        let count = 0;

        if (res.data.socialId === response.googleId) {
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('username', res.data.username);
          count++;

          window.setTimeout(() => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
          }, 24 * 60 * 60 * 60);

          if (count === 1) {
            window.location.reload();
          }
        } else {
          window.location = '/login';
        }
      })
      .catch((err) => console.error(err));
  }

  failureGoogleLogin(response) {
    console.error(response);
    window.location = '/login';
  }

  render() {
    return (
      <div className="container">
        <div className="login">
          <h5>
            Login with your social account
            <span className="full-stop">.</span>
          </h5>
          <hr className="gold-hr" />
          <div className="google">
            <GoogleLogin
              clientId={
                '59148199920-fl7q6lnb3v3uu716bvt2kf3r4fkatutk.apps.googleusercontent.com'
              }
              buttonText="Log in With Google"
              onSuccess={this.successGoogleLogin}
              onFailure={this.failureGoogleLogin}
              cookiePolicy={'single_host_origin'}
              scope="profile"
            />
          </div>
          <br />
        </div>
      </div>
    );
  }
}

export default Login;
