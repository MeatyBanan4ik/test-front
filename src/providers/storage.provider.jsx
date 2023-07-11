import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import StorageContext from '../contexts/storage.context';

function StorageProvider({ children }) {
	const [oldAppointment, setOldAppointment] = useState([]);
	const [newAppointment, setNewAppointment] = useState([]);

	const value = useMemo(
		() => ({
			oldAppointment,
			setOldAppointment,
			newAppointment,
			setNewAppointment,
		}),
		[oldAppointment, newAppointment],
	);

	return (
		<StorageContext.Provider value={value}>{children}</StorageContext.Provider>
	);
}

StorageProvider.propTypes = {
	children: PropTypes.element.isRequired,
};

export default StorageProvider;
