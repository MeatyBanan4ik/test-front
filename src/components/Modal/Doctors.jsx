import React from 'react';
import PropTypes from 'prop-types';

function Row({ title, result }) {
	return (
		<div>
			{result.length > 0 && result[0].id && (
				<div>
					<h5>{title}</h5>
					{result.map((item) => (
						<div key={item.id}>
							{item.id}, {item.time}
							{item.name && <span>, {item.name}</span>}
							{item.birth_of_date && <span>, {item.birth_of_date}</span>}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function Doctors({ result }) {
	return (
		<>
			<Row result={result.successDoctor} title="Success Doctors:" />
			<Row result={result.badDoctor} title="Wrong Doctors:" />
			<Row result={result.doubleDoctor} title="Duplicates Doctors:" />
		</>
	);
}

Doctors.propTypes = {
	result: PropTypes.any.isRequired,
};

Row.propTypes = {
	title: PropTypes.string.isRequired,
	result: PropTypes.any.isRequired,
};

export default Doctors;
