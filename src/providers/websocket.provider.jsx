import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import WebsocketContext from '../contexts/websocket.context';
import WebsocketService from '../services/websocket.service';

function WebsocketProvider({ children }) {
	const value = useMemo(
		() => ({
			subscribe: (name, func) => WebsocketService.on(name, func),
			unsubscribe: (name, func) => WebsocketService.off(name, func),
		}),
		[],
	);

	return (
		<WebsocketContext.Provider value={value}>
			{children}
		</WebsocketContext.Provider>
	);
}

WebsocketProvider.propTypes = { children: PropTypes.node.isRequired };

export default WebsocketProvider;
