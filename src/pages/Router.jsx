import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { APPOINTMENTS_PATH, HOME_PATH } from '../constants/uri.constants';
import Home from './Home';
import Layout from './Layout';
import Appointments from './Appointments';

function AppRouter() {
	return (
		<Routes>
			<Route path={HOME_PATH} element={<Layout />}>
				<Route index element={<Home />} />
				<Route path={APPOINTMENTS_PATH} element={<Appointments />} />
				<Route path="*" element={<div>Not Found</div>} />
			</Route>
		</Routes>
	);
}

export default AppRouter;
