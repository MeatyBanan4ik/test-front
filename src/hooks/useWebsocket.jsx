import { useContext } from 'react';

import WebsocketContext from '../contexts/websocket.context';

export default function useWebsocket() {
	return useContext(WebsocketContext);
}
