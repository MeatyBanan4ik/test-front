import React from 'react';
// eslint-disable-next-line import/no-named-default
import { default as BootstrapModal } from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Doctors from './Doctors';
import Patients from './Patients';
import Appointments from './Appointments';
import ViewCard from './ViewCard';

function Modal({ children, show, handleClose, title }) {
	return (
		<BootstrapModal show={show} onHide={handleClose}>
			<BootstrapModal.Header closeButton>
				<BootstrapModal.Title>{title}</BootstrapModal.Title>
			</BootstrapModal.Header>
			<BootstrapModal.Body>{children}</BootstrapModal.Body>
			<BootstrapModal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</BootstrapModal.Footer>
		</BootstrapModal>
	);
}

Modal.propTypes = {
	children: PropTypes.element.isRequired,
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

Modal.Doctors = Doctors;
Modal.Patients = Patients;
Modal.Appointments = Appointments;
Modal.ViewCard = ViewCard;

export default Modal;
