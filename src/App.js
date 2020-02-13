import React from 'react';
import './App.css';
import { createIframeClient } from '@remixproject/plugin'
import Axios from 'axios';

function App() {
  
  return (
    <div className="App">
      <ContractGetterForm></ContractGetterForm>
    </div>
  ) 
}

class ContractGetterForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { contractAddress: '', client: createIframeClient() }
    this.fetchContract = this.fetchContract.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="ContractGetterForm">
        <div className="panel-body p-3">
          <div className="text-primary" >Input a valid contract address and load the source code in Remix.</div>
          <footer>The contract needs to be verified by http://verificationstaging.komputing.org/</footer>
        </div>
        <div className="panel-body p-3">
          <input className="form-control" value={this.state.contractAddress} onChange={this.handleChange} type="text" name="address" />
          <button className="btn btn-secondary mt-2" onClick={this.fetchContract}>Fetch</button>
          <div className="text-info mt-2" >{this.state.info}</div>
        </div>
      </div>
    ) 
  }

  handleChange (event) {
    this.setState({contractAddress: event.target.value});
  }

  async fetchContract () {
    try {
      this.setState({info: ''});
      const network = await this.state.client.call('network', 'detectNetwork')
      const address = this.state.contractAddress.replace('0x', '')      
      //let contract = await fetch(`http://178.19.221.38:10000/repository/contract/byChainId/${network.id}/${address}`, {mode:'cors'})
      let response = await Axios(`https://verification.komputing.org/repository/contract/byChainId/1/0x033d040e1105332aE77A6C5a2371784c378dF9cE/metadata.json`)
      if (!response) return this.setState({info: `source of ${this.state.contractAddress} not found on network ${network.id}`})
      let contract = response.data
      for (let source in contract['sources']) {
        for (let url in contract['sources'][source].urls) {
          if (url.includes('ipfs')) {
            const content = await this.state.client.call('contentImport', 'resolve', url)
            await this.state.client.call('fileManager', 'setFile', `browser/${source}`, content)
            return
          }
        }
      }
      this.setState({info: 'contract imported'});
   } catch (e) {
     console.log(e)
    this.setState({info: e.message});
   }
  }
}

export default App;
