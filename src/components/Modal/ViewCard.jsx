import React from 'react';
import PropTypes from 'prop-types';

function ViewCard({ data }) {
	return (
		<>
			<p>
				Patient: {data?.patient?.id}
				{data?.patient?.name && <span>, {data.patient?.name}</span>}
				{data?.patient?.dateOfBirth && (
					<span>, {data?.patient?.dateOfBirth}</span>
				)}
			</p>
			<p>
				Doctor: {data?.doctor?.id}
				{data?.doctor?.name && <span>, {data?.doctor?.name}</span>}
				{data?.doctor?.dateOfBirth && (
					<span>, {data?.doctor?.dateOfBirth}</span>
				)}
			</p>
			<p>Appointment: {data?.timeStart}</p>
		</>
	);
}

ViewCard.propTypes = {
	data: PropTypes.any.isRequired,
};

export default ViewCard;
