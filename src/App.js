import React from 'react';
import './App.css';
import { createIframeClient } from '@remixproject/plugin'
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
    this.state = { contractAddress: '', client: createIframeClient(), metadata: {}, compilerVersion: '', abi: '' }
    this.fetchContract = this.fetchContract.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    return (
      <div className="ContractGetterForm">
        <div className="panel-body p-3">
          <div className="text-primary" >Input a valid contract address and load the source code in Remix (Please make sure the right network is selected).</div>
          <footer>The contract needs to be verified by <a target='__blank' href='http://verificationstaging.komputing.org' >http://verificationstaging.komputing.org</a></footer>
        </div>
        <div className="panel-body p-3">
          <input className="form-control" value={this.state.contractAddress} onChange={this.handleChange} type="text" name="address" />
          <button className="btn btn-secondary mt-2" onClick={this.fetchContract}>Fetch</button>
          <div className="text-info mt-2" >{this.state.info}</div>
        </div>
        {this.state.compilerVersion && <div>
          <span className="text-warning">compiler version: </span><span>{this.state.compilerVersion}</span>
        </div>}
        {this.state.compilerVersion &&
          <CopyToClipboard text={this.state.abi} ><button className="btn btn-secondary mt-2" >Copy ABI to clipboard</button></CopyToClipboard>
        }
      </div>
    ) 
  }

  handleChange (event) {
    this.setState({contractAddress: event.target.value});
  }

  async fetchContract () {
    try {
      this.setState({compilerVersion:''})
      this.setState({abi:''})
      this.setState({info: ''});

      const network = await this.state.client.call('network', 'detectNetwork')
      const address = this.state.contractAddress
      let contract = await fetch(`https://verification.komputing.org/repository/contract/byChainId/${network.id}/${address}/metadata.json`)
      if (!contract) return this.setState({info: `ŝource of ${this.state.contractAddress} not found on network ${network.id}`})
      if (!contract.ok) return this.setState({info: `${contract.statusText}. Network: ${network.name}`})
      contract = await contract.json()
      console.log(contract)
      this.setState({compilerVersion:contract.compiler.version})
      this.setState({abi:JSON.stringify(contract.output.abi, null, '\t')})
      await this.state.client.call('fileManager', 'setFile', `${address}/metadata.json`, JSON.stringify(contract, null, '\t'))
      let switched = false
      for (let file in contract['sources']) {
        const urls = contract['sources'][file].urls
        for (let url of urls) {
          if (url.includes('ipfs')) {
            let stdUrl = `ipfs://${url.split('/')[2]}`
            const source = await this.state.client.call('contentImport', 'resolve', stdUrl)
            file = file.replace('browser/', '') // should be fixed in the remix IDE end.
            await this.state.client.call('fileManager', 'setFile', `${address}/${file}`, source.content)
            if (!switched) await this.state.client.call('fileManager', 'switchFile', `${address}/${file}`, source.content)
            switched = true
            break
          }
        }
      }
      this.setState({metadata: contract})
      this.setState({info: 'contract imported'});
   } catch (e) {
      console.log(e)
      this.setState({info: e.message});
   }
  }
}

export default App;
