import React, { Component } from 'react';
import './sass/app.scss';
import OdysseyViewer from './OdysseyViewer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Odyssey Viewer</h2>
        </div>
        <OdysseyViewer />
      </div>
    );
  }
}

export default App;
