import React from 'react'

class SignIn extends React.Component {

  constructor(props) {
    super();
    this.state = {
      signInEmail: '',
      signInPassword: '',
      flash: 'none'
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
    console.log(event.target.value);
    // console.log(event.target.name);
  };

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value});
    // console.log(event.target.value);
  };

  onSubmitSignIn = () => {

    fetch('http://localhost:4000/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {
          email: this.state.signInEmail,
          password: this.state.signInPassword
        }
      )
    }).then(response => response.json())
      .then(user => {
        if(user === 'error logging in'){
          console.log('wrong sigin details');
          this.setState({flash: 'block'});
          this.props.onRouteChange('signin');
        } else {
          console.log('logged in user ', user[0]);
          this.setState({flash: 'block'});
          this.props.loadUser(user[0]);
          this.props.onRouteChange('home');
        }

      })
  };

  render() {
    const {onRouteChange} = this.props;
    return (
      <article className="br3 ba dark-gray shadow-5 b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
        <main className="pa4 black-80" style={{height: 330}}>
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f2 fw6 ph0 mh0">Sign In</legend>
              <h4 style={{display: this.state.flash}}>Incorrect email or password</h4>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email"
                  id="email-address"
                  required
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
                // onClick={() => onRouteChange('home')}
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign In"
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article>

    )
  }
}

export default SignIn;