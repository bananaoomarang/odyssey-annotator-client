import React      from 'react';
import axios      from 'axios';
import debounce   from 'lodash.debounce';

import DataForm   from './DataForm';

const { REACT_APP_API_URL } = process.env;

class Book extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines:     [],
      trans:     '',
      showModal: false
    }

    this.updateBook  = debounce(this.updateBook.bind(this), 250);
    this.handleWord  = this.handleWord.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  updateBook() {
    axios
      .get([REACT_APP_API_URL, 'book', this.props.no].join('/'))
      .then(res => this.setState({
        lines: res.data.greek.lines,
        trans: res.data.english.text.split('.').join('.<br/><br/>')
      }))
      .catch(err => console.error(err))
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal })
  }

  handleWord(e) {
    const word = e.target.textContent;

    this.toggleModal()
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
        <div className="-container">
          <div className="-col-6">
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
          <div className="-col-6" dangerouslySetInnerHTML={ { __html: this.state.trans } }>
          </div>
        </div>
        <DataForm
            show={this.state.showModal}
            toggleModal={this.toggleModal}
        />
      </div>
    )
  }
}

export default Book;
