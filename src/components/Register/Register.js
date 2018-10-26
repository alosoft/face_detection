import React from 'react'
import './Register.css';


class Register extends React.Component {

  constructor(props) {
    super();
    this.state = {
      email: '',
      password: '',
      name: '',
      flashEmail: 'none',
      flashField: 'none'
    }
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value})
    // console.log(event.target.value);
  };

  onEmailChange = (event) => {
    this.setState({email: event.target.value})
    // console.log(event.target.value);
  };

  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
    // console.log(event.target.value);
  };

  onSubmitSignIn = () => {
    // console.log(this.state);
    fetch('http://localhost:4000/register', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {
          email: this.state.email,
          password: this.state.password,
          name: this.state.name
        }
      )
    }).then(response => response.json())
      .then(user => {
        // console.log('response from register route', user);
        if (user === 'email exist') {
          // console.log('email exist');
          this.setState({flashEmail: 'block'});
          this.props.onRouteChange('register');
        } else {
          // console.log('logged in user ', user);
          // console.log(user);
          if (user === 'empty fields') {
            this.setState({flashField: 'block'});
          } else {
            this.setState({flashEmail: 'none'});
            this.props.loadUser(user);
            this.props.onRouteChange('home');
          }

        }
      })
  };


  render() {

    const {onRouteChange} = this.props;

    return (
      <article className="br3 ba dark-gray shadow-5 b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f2 fw6 ph0 mh0">Register</legend>
              <h4 style={{display: this.state.flashEmail}}>Email already taken</h4>
              <h4 style={{display: this.state.flashField}}>All fields are required</h4>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                <input
                  onChange={this.onNameChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name" id="name"
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address" id="email-address"
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  onChange={this.onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"/>
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('signin')} className="f6 link dim black db pointer">Sign In</p>
            </div>
          </div>
        </main>
      </article>

    )
  }
}

export default Register;