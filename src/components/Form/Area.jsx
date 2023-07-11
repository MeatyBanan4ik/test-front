import React, { useId } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function FormArea({ value, onChange, label }) {
	const controlId = useId();
	return (
		<Form.Group controlId={controlId}>
			<Form.Label>{label}</Form.Label>
			<Form.Control as="textarea" rows={20} value={value} onChange={onChange} />
		</Form.Group>
	);
}

FormArea.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
};

export default FormArea;
