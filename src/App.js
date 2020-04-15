import React from 'react';
import {createIframeClient} from '@remixproject/plugin'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {VerifyContract} from "./components/verify-contract/VerifyContract";
import {ContractFetcher} from "./components/contract-fetcher/ContractFetcher";

function App() {
  const client = createIframeClient();
  console.log(client);

  return (
    <div className="App">
      <VerifyContract/>
      {/*<ContractFetcher client={client}/>*/}
      {/*<ContractGetterForm/>*/}
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
}

export default App;
