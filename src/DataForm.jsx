import React        from 'react';
import axios        from 'axios';
import ReactModal   from 'react-modal';

const { REACT_APP_API_URL } = process.env;

const INTERACTION_TYPES = [
  'INR.NONVERBAL-FAR',
  'INR.NONVERBAL-NEAR',
  'INR.VERBAL-FAR',
  'INR.VERBAL-NEAR',
  'COG-NEAR',
  'COG-FAR',
  'PCR'
]

const ENTITY_TYPES = [
  'PER.INDIVIDUAL',
  'PER.GROUP',
  'PER.INDETERMINATE'
]

function renderText(text) {
  if(!text) {
    return 'No text selected';
  }

  return text
    .replace(/[0-9]+/g, '')
    .replace(/\n/g, '<br/>')
}

class DataForm extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      ['person-from']: '',
      ['person-to']:   '',
      type: INTERACTION_TYPES[0],
      existingEntities: []
    }
    
    this.state = Object.assign({}, this.defaultState);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddCharacter = this.handleAddCharacter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.fetchEntities = this.fetchEntities.bind(this);
  }

  componentDidMount() {
    this.fetchEntities()
  }

  fetchEntities() {
    axios
      .get([REACT_APP_API_URL, 'entities'].join('/'))
      .then((res) => {
        this.setState({
          existingEntities: res.data,
          ['person-from']: res.data[0].name,
          ['person-to']:   res.data[0].name
        })
      })
      .catch((err) => console.error(err))
  }

  handleSubmit(e) {
    e.preventDefault();

    const post_data = {
      type: this.state['type'],
      from: this.state['person-from'],
      to:   this.state['person-to']
      
    }
    console.log(post_data)

    axios.post([REACT_APP_API_URL, 'interactions'].join('/'), post_data)
      .then(({ data }) => console.log(data))
      .catch((err) => console.error(err))

    this.props.toggleModal();
  }

  handleAddCharacter(e) {
    e.preventDefault();

    const post_data = {
      name: this.state['character-name'],
      metadata: this.state['character-metadata']
    }

    axios.post([REACT_APP_API_URL, 'entities'].join('/'), post_data)
      .then(({ data }) => {
        this.fetchEntities()
        this.setState({
          ['character-name']:     '',
          ['character-metadata']: ''
        })
      })
      .catch((err) => console.error(err))
  }

  handleTextChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    })
  }

  render() {
    console.log(this.state)
    return (
      <ReactModal
          className="body"
          portalClassName="DataForm"
          overlayClassName="overlay"
          isOpen={this.props.show}
          contentLabel="form for data input"
      >
        <div className="selected-text-wrapper">
          <div className="selected-text" dangerouslySetInnerHTML={{ __html: renderText(this.props.selection.text)}}/>
        </div>
        <form className="form">
          <div className="text-inputs">
            <select className="text-input" name="person-from" value={this.state["person-from"]} onChange={(e) => this.setState({ ['person-from']: e.target.value })}>
              {
                this.state.existingEntities.map(({ name }) => (
                  <option name={name} key={name}>{name}</option>
                ))
              }
            </select>
            <span>----></span>
            <select className="text-input" name="person-to" value={this.state["person-to"]} onChange={(e) => this.setState({ ['person-to']: e.target.value })}>
              {
                this.state.existingEntities.map(({ name }) => (
                  <option name={name} key={name}>{name}</option>
                ))
              }
            </select>
          </div>

          <hr />
          
          <select className="interaction-types" onChange={(e) => this.setState({ type: e.target.value })} value={this.state.type}>
            {
              INTERACTION_TYPES.map((type) => (
                <option className="interaction" key={type} value={type} >
                  {type}
                </option>
              ))
            }
          </select>

          <hr/>
          <div className="buttons">
            <input type="submit" value="OK" onClick={this.handleSubmit} />
            <button onClick={this.props.toggleModal}>Close</button>
          </div>
        </form>

        <hr />

        <form className="form">
          <input className="text-input" name="character-name" type="text" placeholder="New Character" value={this.state['character-name']} onChange={this.handleTextChange} />
          <input className="text-input" name="character-metadata" type="text" placeholder="Metadata" value={this.state['character-metadata']} onChange={this.handleTextChange} />
          <input type="submit" value="Add Character" onClick={this.handleAddCharacter} />
        </form>
      </ReactModal>
    )
  }
}

export default DataForm;
