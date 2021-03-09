const  superagent  =  require('superagent');

import { createLogPayload, createColorPayload, createHtmlPayload } from './payloadUtils';

export class Ray {
	public uuid: string | null = null;
	
	public color(name: string): Ray {
		const payload = createColorPayload(name, this.uuid);		
		return this.sendRequest(payload);
	}
	
	public html(name: string): Ray {
		const payload = createHtmlPayload(name, this.uuid);		
		return this.sendRequest(payload);	
	}

	public send(...args: any[]): Ray {
		const payload = createLogPayload(args, this.uuid);			
		this.sendRequest(payload);
		
		return this;
	}

    public ban(): Ray {
	    return this.send('🕶');
    }
    
	public charles(): Ray {
	    return this.send('🎶 🎹 🎷 🕺');
    }
	
	public sendRequest(request: any): Ray {
		this.uuid = request.uuid;
        superagent.post(`http://localhost:23517/`).send(request).then(resp => { }).catch(err => {});		
	
		return this;
	}
}

export function ray(...args) {
    return (new Ray()).send(...args);
}

export default Ray;
