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
      selection: {
        text: ''
      },
      showModal: false
    }

    this.updateBook  = debounce(this.updateBook.bind(this), 250);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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

  toggleModal(bool) {
    if(typeof bool === 'boolean') {
      return this.setState({ showModal: bool })
    }

    this.setState({ showModal: !this.state.showModal })
  }

  handleMouseUp(e) {
    const sel         = window.getSelection();
    const text        = sel.toString();
    const from_line   = sel.baseNode.parentElement.dataset.lineNo;
    const to_line     = sel.extentNode.parentElement.dataset.lineNo;
    const from_offset = sel.baseOffset;
    const to_offset   = sel.extentOffset;

    this.setState({
      selection: {
        text,
        from_line,
        to_line,
        from_offset,
        to_offset
      }
    })

    this.toggleModal(true)
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
      <div className="Book" onMouseUp={this.handleMouseUp}>
        <div className="-container">
          <div className="-col-6">
            {
              this.state.lines.map((line, index) => {
                return (
                  <div key={index} className="line">
                    <div className="line-no">{index + 1}</div>
                    <span data-line-no={index + 1}>{line}</span>
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
            selection={this.state.selection}
        />
      </div>
    )
  }
}

export default Book;
