import React      from 'react';
import axios      from 'axios';
import debounce   from 'lodash.debounce';
import classnames from 'classnames';

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
      existingInteractions: [],
      showModal: false,
      greekPullup: 0
    }

    this.updateBook  = debounce(this.updateBook.bind(this), 500);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.fetchInteractions = this.fetchInteractions.bind(this);
  }

  fetchInteractions() {
    axios
      .get([REACT_APP_API_URL, 'interactions'].join('/') + '?book=' + this.props.no)
      .then((res) => {
        this.setState({
          existingInteractions: res.data,
        })
      })
      .catch((err) => console.error(err))
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
    this.fetchInteractions();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.no !== this.props.no) {
      this.updateBook();
      this.fetchInteractions();
    }

    if(prevState.showModal !== this.state.showModal && !this.state.showModal) {
      this.fetchInteractions();
    }
  }

  render() {
    const greekStyle = {
      marginTop: -this.state.greekPullup
    }

    return (
      <div className="Book">
        <input type="text"
               style={{ position: 'fixed', top: '2em', left: '2em' }}
               placeholder="pullup"
               value={this.state.greekPullup}
               onChange={({ target }) => this.setState({ greekPullup: target.value })} />

        <div className="-container" onMouseUp={this.handleMouseUp}>
          <div className="-col-6" style={greekStyle}>
            {
              this.state.lines.map((line, index) => {
                const lineNo = index + 1;
                const lineHighlighted = this.state.existingInteractions
                                            .some((interaction) => (lineNo >= interaction.selection.from_line && lineNo <= interaction.selection.to_line))

                const classes = classnames('line', { ['-hl']: lineHighlighted })

                return (
                  <div key={index} className={classes}>
                    <div className="line-no">{lineNo}</div>
                    <span data-line-no={lineNo}>{line}</span>
                  </div>
                )
              })
            }
          </div>
          <div className="-col-6" dangerouslySetInnerHTML={ { __html: this.state.trans } }>
          </div>
        </div>
        <DataForm
            book_no={this.props.no}
            show={this.state.showModal}
            toggleModal={this.toggleModal}
            selection={this.state.selection}
        />
      </div>
    )
  }
}

export default Book;
