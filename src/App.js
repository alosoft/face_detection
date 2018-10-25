import React, {Component} from 'react';
import Navigation from './components/Navigation/Navagation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import 'tachyons';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions = {
  "particles": {
    "number": {
      "value": 125,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "move": {
      "enable": true,
      "speed": 20,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    }
  },
};

// instantiate a new Clarifai app passing in your api key.
const app = new Clarifai.App({
  // apiKey: 'fc7b8874f4d7454f9931fb7a4fc05010'
  // apiKey: '9a970029bf8b49fe9bd5ed6a086d0a75'
  apiKey: '4310f0a1837d4c048112e3847b4976a8'
});

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        _id: '',
        user_id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (user) => {
    this.setState(
      {
        user: {
          _id: String(user._id),
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          entries: user.entries,
          joined: user.joined,
          password: user.password
        }
      }
    );
    console.log('loaded user', this.state.user);
  };

  // componentDidMount() {
  //   fetch('http://localhost:4000/')
  //     .then(response => response.json())
  //     .then(data => console.log('from local API', data))
  //     .catch(error => console.log(error))
  //
  //
  // }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  };

  getUsername = (data) => {
    this.setState({username: data});
    console.log(this.state.username);
  };

  displayFaceBox = (box) => {
    this.setState({box: box});
    // console.log(box);
  };

  onInputChange = (event) => {
    this.setState(
      {input: event.target.value}
    );
  };

  onPictureSubmit = () => {
    this.setState(
      {imageUrl: this.state.input}
    );
    console.log('user state before button click', this.state.user);

    // predict the contents of an image by passing in a url
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input)
    // .then(response => console.log(response.outputs[0].data.regions[0].region_info.bounding_box))
      .then(response => {

        if (response) {

          fetch('http://localhost:4000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
              {
                _id: this.state.user._id,
                // user_id: this.state.user.user_id,
                entries: this.state.user.entries + 1,
                // name: this.state.user.name,
                // email: this.state.user.email,
                // password: this.state.user.password,
                // joined: this.state.user.joined
              }
            )
          }).then(response => response.json())
            .then(rank => {
              console.log('user state after button click', rank);
              // this.setState({user: {entries: rank}}) // this changes the user object entirely (erases the rest)
              this.setState(Object.assign(this.state.user, {entries: rank})) //this updates only the entries in the user object
            })
            .catch(console.log);
        }

        this.displayFaceBox(this.calculateFaceLocation(response));
        // console.log('current state after picture submit', this.state.user);
      })
      .catch(error => {
        console.log(error);
      });

  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
      // console.log('sign out came through');
      this.setState({route: route});


    } else if (route === 'home') {
      // console.log('before sign in came through', this.state.isSignedIn);
      this.setState({isSignedIn: true});
      // console.log('sign in came through and isSignedIn is ', this.state.isSignedIn);
      this.setState({route: route});

    } else {
      // console.log('...else came through', this.state.route, this.state.isSignedIn);
      this.setState({isSignedIn: false});
      // this.setState({route: route});
      this.setState({
        input: '',
        imageUrl: '',
        box: {},
        route: route,
        isSignedIn: false,
        user: {
          _id: '',
          user_id: '',
          name: '',
          email: '',
          password: '',
          entries: 0,
          joined: ''
        }
      })
      // console.log('after else came through', this.state.route, this.state.isSignedIn)
    }

  };

  onSignInInputChange = (event) => {
    console.log(event.target.value)
  };


  render() {

    const {user, box, isSignedIn, imageUrl, route} = this.state; // so you can remove this.state from state objects in the return statement below

    return (
      <div className="App">
        <Particles className='particle'
                   params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {route === 'signin'
          ? <SignIn getUsername={this.getUsername} onRouteChange={this.onRouteChange}
                    onSignInInputChange={this.onSignInInputChange}
                    loadUser={this.loadUser}
          />
          : (route === 'home'
              ? <div>

                < Logo/>
                < Rank user={user}/>
                < ImageLinkForm onInputChange={this.onInputChange}
                                onPictureSubmit={this.onPictureSubmit}
                />
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
              : <Register onRouteChange={this.onRouteChange}
                          onSignInInputChange={this.onSignInInputChange}
                          loadUser={this.loadUser}
              />
          )
        }
      </div>
    );
  }
}

export default App;
