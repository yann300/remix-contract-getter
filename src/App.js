import React from 'react';
import './App.css';
import { createIframeClient } from '@remixproject/plugin'

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
      let contract = await fetch(`http://178.19.221.38:10000/repository/contract/byChainId/${network.id}/${address}`, {mode:'cors'})
      if (!contract) return this.setState({info: `ŝource of ${this.state.contractAddress} not found on network ${network.id}`})
      contract = JSON.parse(contract)
      for (let source in contract['sources']) {
        for (let url of contract['sources'][source]) {
          if (url.incudes('ipfs')) {
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
