import EventEmitter from 'events';
import { BASE_WS_URL } from '../constants/api.constants';

class WebsocketService extends EventEmitter {
	constructor() {
		super();
		this.connect();
	}

	connect() {
		this.ws = new WebSocket(BASE_WS_URL);

		this.ws.onopen = () => {
			clearTimeout(this.reconect);
			this.tryConnect = false;

			this.interval = setInterval(() => {
				this.ws.send(JSON.stringify({ type: 'ping' }));
			}, 30 * 1000);
		};

		this.ws.onmessage = ({ data: message }) => {
			try {
				const { type = '', data } = JSON.parse(message);
				this.emit(type, data);
			} catch (e) {
				console.error(e);
			}
		};

		this.ws.onclose = () => {
			clearInterval(this.interval);
			if (this.tryConnect === true) {
				return void 0;
			}

			this.tryConnect = true;

			this.reconect = setTimeout(() => {
				this.tryConnect = false;
				this.connect();
			}, 5000);

			return void 0;
		};
	}
}

export default new WebsocketService();
