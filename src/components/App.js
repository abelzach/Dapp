import React, { Component } from 'react';
import Web3 from 'web3';
import Helloworld from '../abis/Helloworld.json'
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should use the MetaMask extension!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Helloworld.networks[networkId]
    if(networkData) {
      const hlw = web3.eth.Contract(Helloworld.abi, networkData.address)
      this.setState({ hlw })
      const name = await hlw.methods.name().call()
      this.setState({ loading: false})
    } else {
      window.alert('The dApp contract could not be deployed to network')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      hlw: null,
      name: '',
      loading: true
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hello World DApp
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Ethereum dApp</h1>
                <br/><br/>
                <h3>
                  Your dApp says: {this.state.name}
                </h3>
                <br/>
                <p>
                Congrats on deploying your first dApp!
                </p>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
