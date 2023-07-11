import React from 'react';
import PropTypes from 'prop-types';

function Row({ title, result }) {
	return (
		<div>
			{result.length > 0 && result[0].id && (
				<div>
					<h5>{title}</h5>
					{result.map((item) => (
						<div>
							{item.patient}, {item.doctor}, {item.time_start}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function Appointments({ result }) {
	return (
		<>
			<Row result={result.successAppointments} title="Success Appointments:" />
			<Row result={result.badAppointments} title="Wrong Appointments:" />
		</>
	);
}

Appointments.propTypes = {
	result: PropTypes.any.isRequired,
};

Row.propTypes = {
	title: PropTypes.string.isRequired,
	result: PropTypes.any.isRequired,
};

export default Appointments;
