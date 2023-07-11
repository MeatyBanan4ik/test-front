import React from 'react';

export default React.createContext({
	oldAppointment: [],
	setOldAppointment: () => {},
	newAppointment: [],
	setNewAppointment: () => {},
});
