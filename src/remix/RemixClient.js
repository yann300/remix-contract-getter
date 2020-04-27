import {connectIframe, listenOnThemeChanged, PluginClient} from '@remixproject/plugin';
import axios from 'axios';
import { SERVER_URL, REPOSITORY_URL } from '../common/Constants';

export class RemixClient extends PluginClient {

    constructor() {
        super();
        this.methods = ["fetch", "verify"];
        connectIframe(this);
        listenOnThemeChanged(this);
        this.client = this;
    }

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

    getFolderByAddress = async (address) => {
        return this.client.call('fileManager', 'getFolder', this.getBrowserPath(address))
    }

    getCurrentFile = async () => {
        return this.client.call('fileManager', 'getCurrentFile');
    }

    createFile = async (name, content) => {
        try {
            await this.client.call('fileManager', 'setFile', name, content)
        } catch (err) {
            console.log(err)
        }
    }

    switchFile = async (name) => {
        await this.client.call('fileManager', 'switchFile', name)
    }

    getBrowserPath = (path) => {
        if (path.startsWith('browser/')) {
            return path;
        }
        return `browser/${path}`;
    }

    contentImport = async (stdUrl) => {
        return await this.client.call('contentImport', 'resolve', stdUrl)
    }

    listenOnCompilationFinishedEvent = async (callback) => {
        await this.client.onload();
        this.client.on('solidity', 'compilationFinished', (target, source, _version, data) => {
            callback({ 
                target, 
                source: source.sources[target].content, 
                contract: data.contracts[target] 
            });
        });
    }

    detectNetwork = async () => {
        await this.client.onload();
        return await this.client.call('network', 'detectNetwork')
    }

    fetchAndSave = async (address, chain) => {
        const result = await this.fetch(address, chain) 
        await this.saveFetchedToRemix(result.metadata, result.contract, address)       
    }

    test = async () => {
        try {
            const data = await this.client.call('source-verification', 'fetch', '0x000F35ec1acd193C2A11651c8A6e7D2fc99ACB7d', 3)
            console.log(data)    
        } catch (e) {
            console.log(e.message)
        }
    
    }

    fetch = async (address, chain) => {
        return new Promise(async (resolve, reject) => {
            try {
                let network = await this.detectNetwork()
                if(network.id === "-") {
                    network = chain;
                }

                let response = await axios.get(`${SERVER_URL}/files/${network.name.toLowerCase()}/${address}`)
              
                if (!response) reject({info: `ŝource of ${address} not found on network ${network.id}`})
                if (!(response.status === 200)) reject({info: `${response.status}. Network: ${network.name}`}) 

                let metadata;
                let contract;
                for(let i in response.data){
                    const file = response.data[i];
                    if(file.name.endsWith('json')){
                        metadata = JSON.parse(file.content);
                    } else if (file.name.endsWith('sol')){
                        contract = file.content;
                    }
                };

                console.log({ "metadata": metadata, "contract": contract });
                resolve({ "metadata": metadata, "contract": contract });
                } catch(err) {
                    reject(err);
                }   
        });
    }

    saveFetchedToRemix = async (metadata, contract, address) => {
            try {
            let compilerVersion = metadata.compiler.version;
            let abi = JSON.stringify(metadata.output.abi, null, '\t');
            console.log(address)
            this.createFile(`/verified-sources/${address}/metadata.json`, JSON.stringify(metadata, null, '\t'))
            let switched = false
            for (let file in metadata['sources']) {
                console.log(file)
                const urls = metadata['sources'][file].urls
                for (let url of urls) {
                    if (url.includes('ipfs')) {
                        let stdUrl = `ipfs://${url.split('/')[2]}`
                        const source = await this.contentImport(stdUrl)
                        file = file.replace('browser/', '')
                        if(source.content) this.createFile(`/verified-sources/${address}/${file}`, source.content)
                        if (!switched) await this.switchFile(`${address}/${file}`)
                        switched = true
                        break
                    }
                }
            }
        } catch(err){
            console.log(err)
        }
        
    }


    verify = async (formData) => {
        return axios.post(`${SERVER_URL}`, formData);
    }
}

export const remixClient = new RemixClient()
