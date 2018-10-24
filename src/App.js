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
  apiKey: '9a970029bf8b49fe9bd5ed6a086d0a75'
});

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

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

  displayFaceBox = (box) => {
    this.setState({box: box});
    // console.log(box);
  };

  onInputChange = (event) => {
    this.setState(
        {input: event.target.value}
    );
  };

  onButtonSubmit = () => {
    this.setState(
        {imageUrl: this.state.input}
    );

    // predict the contents of an image by passing in a url
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, this.state.input)
    // .then(response => console.log(response.outputs[0].data.regions[0].region_info.bounding_box))
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
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
      this.setState({route: route});
      // console.log('after else came through', this.state.route, this.state.isSignedIn)
    }

  };

  onSignInInputChange = (event) => {
    console.log(event.target.value)
  };


  render() {

    const {box, isSignedIn, imageUrl, route} = this.state; // so you can remove this.state from state objects in the return statement below

    return (
        <div className="App">
          <Particles className='particle'
                     params={particlesOptions}
          />
          <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
          {route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange}
                        onSignInInputChange={this.onSignInInputChange}/>
              : (route === 'home'
                      ? <div>

                        < Logo/>
                        < Rank/>
                        < ImageLinkForm onInputChange={this.onInputChange}
                                        onButtonSubmit={this.onButtonSubmit}
                        />
                        <FaceRecognition box={box} imageUrl={imageUrl}/>
                      </div>
                      : <Register onRouteChange={this.onRouteChange}
                                  onSignInInputChange={this.onSignInInputChange}/>
              )
          }
        </div>
    );
  }
}

export default App;
