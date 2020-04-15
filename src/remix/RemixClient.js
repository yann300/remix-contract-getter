import { Api, createIframeClient, HighlightPosition, PluginClient, RemixApi } from '@remixproject/plugin';

export class RemixClient extends PluginClient {

    /**
     *
     */
    constructor() {
        super();
        this.methods = ["fetch", "validate"]
    }  

    client = createIframeClient();

    createClient = () => {
        return this.client.onload();
    }

    getFile = async (name) => {
        return new Promise(async (resolve, reject) => {
            let path = name.startsWith('./') ? name.substr(2) : name;
            let content = await this.client.call('fileManager', 'getFile', this.getBrowserPath(path));
            if (content) {
                resolve(content);
            } else {
                reject(`Could not find "${name}"`)
            }
        });
    }

    getFolder = async() => {
        return this.client.call('fileManager', 'getFolder', '/browser');
    }

    getCurrentFile = async () => {
        return this.client.call('fileManager', 'getCurrentFile');
    }

    createFile = async (name, content) => {
        try {
            await this.client.call('fileManager', 'setFile', name, content)
            //await this.client.call('fileManager', 'switchFile', name)
        } catch (err) {
            console.log(err)
        }
    }

    highlight = async (position, file, color) => {
        await this.client.call('editor', 'highlight', position, this.getBrowserPath(file), color);
    }

    discardHighlight = async () => {
        await this.client.call('editor', 'discardHighlight');
    }

    switchFile = async (file) => {
        await this.client.call('fileManager', 'switchFile', this.getBrowserPath(file));
    }

    getBrowserPath = (path) => {
        if (path.startsWith('browser/')) {
            return path;
        }
        return `browser/${path}`;
    }


    fetch = async (address, ) => {
        return new Promise(async (resolve, reject) => {
            const network = await this.client.call('network', 'detectNetwork')
            let contract = await fetch(`https://verification.komputing.org/repository/contract/byChainId/${network.id}/${address}/metadata.json`)
            if (!contract) reject({info: `ŝource of ${this.state.contractAddress} not found on network ${network.id}`})
            if (!contract.ok) reject({info: `${contract.statusText}. Network: ${network.name}`})
            contract = await contract.json()
            console.log(contract)

            compilerVersion = contract.compiler.version;
            abi = JSON.stringify(contract.output.abi, null, '\t');
            this.createFile(`${address}/metadata.json`, JSON.stringify(contract, null, '\t'))
            let switched = false
            for (let file in contract['sources']) {
                const urls = contract['sources'][file].urls
                for (let url of urls) {
                  if (url.includes('ipfs')) {
                    let stdUrl = `ipfs://${url.split('/')[2]}`
                    const source = await this.state.client.call('contentImport', 'resolve', stdUrl)
                    file = file.replace('browser/', '') // should be fixed in the remix IDE end.
                    this.createFile(`${address}/${file}`, source.content)
                    if (!switched) this.switchFile(`${address}/${file}`, source.content)
                    switched = true
                    break
                  }
                }
              }
            resolve(); //TODO:
        });
  }

  validate = async () => {
      
  }

}

export const remixClient = new RemixClient()
