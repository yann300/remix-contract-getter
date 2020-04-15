import { Api, createIframeClient, HighlightPosition, PluginClient, RemixApi } from '@remixproject/plugin';
import axios from 'axios';

export class RemixClient extends PluginClient {

    constructor() {
        super();
        this.methods = ["fetch", "verify"]
    }  

    client = createIframeClient();
    baseUrl = "https://contractrepo.komputing.org/contract/byChainId"

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

    getFolderByAddress = async(address) => {
        return this.client.call('fileManager', 'getFolder', `/browser/${address}`)
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
    
    contentImport = (stdUrl) => {
        await this.client.call('contentImport', 'resolve', stdUrl)
    }


    fetch = async (address) => {
        return new Promise(async (resolve, reject) => {
            const network = await this.client.call('network', 'detectNetwork')
            let files = await axios.get(`${baseUrl}/${network.id}/${address}`)
            let metadata;
            let contract;

            files.forEach(file => {
                // check names of the files
            });

            if (!metadata) reject({info: `ŝource of ${address} not found on network ${network.id}`})
            if (!metadata.ok) reject({info: `${metadata.statusText}. Network: ${network.name}`}) // TODO: check how axios operates on this
            metadata = await metadata.json()

            compilerVersion = metadata.compiler.version;
            abi = JSON.stringify(metadata.output.abi, null, '\t');
            this.createFile(`${address}/metadata.json`, JSON.stringify(metadata, null, '\t'))
            let switched = false
            for (let file in metadata['sources']) {
                const urls = metadata['sources'][file].urls
                for (let url of urls) {
                  if (url.includes('ipfs')) {
                    let stdUrl = `ipfs://${url.split('/')[2]}`
                    const source = this.contentImport(stdUrl)
                    file = file.replace('browser/', '') // should be fixed in the remix IDE end.
                    this.createFile(`${address}/${file}`, source.content)
                    if (!switched) this.switchFile(`${address}/${file}`, source.content)
                    switched = true
                    break
                  }
                }
              }
            resolve(address);
        });
  }

  verify = async (formData) => {
    return new Promise(async (resolve, reject) => {
            let response = await axios(`${serverUrl}`, {
                method: 'POST',
                body: formData
            })
            resolve(response);
        })
  }

}

export const remixClient = new RemixClient()
