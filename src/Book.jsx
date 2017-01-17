import React from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const API_URL = 'http://localhost:5000'

class Book extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: []
    }

    this.updateBook = debounce(this.updateBook.bind(this), 250);
  }

  updateBook() {
    axios
      .get([API_URL, 'book', this.props.no].join('/'))
      .then(res => this.setState({ lines: res.data.book.lines }))
      .catch(err => console.error(err))
  }

  handleWord(e) {
    console.log(e.target.textContent);
  }

  componentDidMount() {
    this.updateBook();
  }

  componentDidUpdate(nextProps) {
    if(nextProps.no !== this.props.no) {
      this.updateBook()
    }
  }

  render() {
    return (
      <div className="Book">
        {
          this.state.lines.map((line, index) => {
            return (
              <div key={index} className="line">
                <div className="line_no">{index + 1}</div>
                {
                  line.split(' ').map((word, index) => {
                    return (
                      <span
                        className="word"
                        key={index}
                        onClick={this.handleWord}
                      >
                        {word}
                        &nbsp;
                      </span>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Book;
