import React from 'react';
import Book from './Book';

class OdysseyViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book_no: 1
    }

    this.handleSlider = this.handleSlider.bind(this);
  }

  handleSlider(e) {
    this.setState({
      book_no: e.target.value
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Book {this.state.book_no}</h1>

        <div className="Controls">
          <input
            type="range"
            min="1"
            max="24"
            step="1"
            defaultValue="1"
            onChange={this.handleSlider}
          />
        </div>

        <Book no={this.state.book_no} />
      </div>
    );
  }
}

export default OdysseyViewer;
