import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './pages/Router';
import AxiosProvider from './providers/axios.provider';
import StorageProvider from './providers/storage.provider';
import WebsocketProvider from './providers/websocket.provider';

function App() {
	return (
		<AxiosProvider>
			<WebsocketProvider>
				<StorageProvider>
					<BrowserRouter>
						<AppRouter />
					</BrowserRouter>
				</StorageProvider>
			</WebsocketProvider>
		</AxiosProvider>
	);
}

export default App;
