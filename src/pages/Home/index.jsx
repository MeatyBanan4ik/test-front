import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import FormArea from '../../components/Form/Area';
import Modal from '../../components/Modal';

function Home() {
	const [patients, setPatients] = useState('');
	const [doctors, setDoctors] = useState('');
	const [appointments, setAppointments] = useState('');
	const [message, setMessage] = useState('');
	const [show, setShow] = useState(false);
	const [modalData, setModalData] = useState({});

	const clearData = async () => {
		const res = await axios.delete('api/hospital');

		if (res) {
			setMessage(
				`Deleted patients: ${res.data.patients} | Deleted doctors: ${res.data.doctors} | Deleted appointments: ${res.data.appointment}`,
			);
		}
	};

	const sendData = async () => {
		if (!patients.length && !appointments.length && !doctors.length)
			return void 0;
		const data = {};

		data.patients = patients
			.trim()
			.split('\n')
			.map((patient) => {
				const arr = patient.split(',');

				const fields = {};

				if (arr[0]) {
					fields.id = arr[0].trim();
				}

				if (arr[1]) {
					fields.time = arr[1].trim();
				}

				if (arr[2]) {
					if (Number.isNaN(Date.parse(arr[2]))) {
						fields.name = arr[2].trim();
						fields.date_of_birth = arr[3]?.trim() ?? undefined;
					} else {
						fields.date_of_birth = arr[2].trim();
						fields.name = arr[3]?.trim() ?? undefined;
					}
				}

				fields.other_data = Boolean(arr.length > 4 && arr.splice(4).length);

				return fields;
			});

		data.doctors = doctors
			.trim()
			.split('\n')
			.map((doctor) => {
				const arr = doctor.split(',');

				const fields = {};

				if (arr[0]) {
					fields.id = arr[0].trim();
				}

				if (arr[1]) {
					fields.time = arr[1].trim();
				}

				if (arr[2]) {
					if (Number.isNaN(Date.parse(arr[2]))) {
						fields.name = arr[2].trim();
						fields.date_of_birth = arr[3]?.trim() ?? undefined;
					} else {
						fields.date_of_birth = arr[2].trim();
						fields.name = arr[3]?.trim() ?? undefined;
					}
				}

				fields.other_data = Boolean(arr.length > 4 && arr.splice(4).length);

				return fields;
			});

		data.appointments = appointments
			.trim()
			.split('\n')
			.map((doctor) => {
				const arr = doctor.split(',');

				return {
					patient: arr[0]?.trim(),
					doctor: arr[1]?.trim(),
					time_start: arr[2]?.trim(),
					other_data: Boolean(arr.length > 3 && arr.splice(3).length),
				};
			});
		const res = await axios.post('api/hospital', data);

		setModalData({
			successPatients: res?.data?.validated?.patients ?? [],
			badPatients:
				res?.data?.unvalidated?.patients?.filter(
					(item) => item.error !== 'Duplicate',
				) ?? [],
			doublePatients:
				res?.data?.unvalidated?.patients?.filter(
					(item) => item.error === 'Duplicate',
				) ?? [],
			successDoctor: res?.data?.validated?.doctors ?? [],
			badDoctor:
				res?.data?.unvalidated?.doctors?.filter(
					(item) => item.error !== 'Duplicate',
				) ?? [],
			doubleDoctor:
				res?.data?.unvalidated?.doctors?.filter(
					(item) => item.error === 'Duplicate',
				) ?? [],
			successAppointments: res?.data?.validated?.appointments ?? [],
			badAppointments: res?.data?.unvalidated?.appointments ?? [],
		});
		setPatients('');
		setDoctors('');
		setAppointments('');
		setShow(true);
		return void 0;
	};

	return (
		<>
			<h1>{message}</h1>
			<Row className="mt-5">
				<Col>
					<FormArea
						onChange={(e) => setPatients(e.target.value)}
						label="Patients"
						value={patients}
					/>
				</Col>
				<Col>
					<FormArea
						onChange={(e) => setDoctors(e.target.value)}
						label="Doctors"
						value={doctors}
					/>
				</Col>
				<Col>
					<FormArea
						onChange={(e) => setAppointments(e.target.value)}
						label="Appointments"
						value={appointments}
					/>
				</Col>
			</Row>
			<Row className="justify-content-end pt-5">
				<Col xs="auto">
					<Button variant="success" onClick={sendData}>
						Send Data
					</Button>
				</Col>
				<Col xs="auto">
					<Button variant="danger" onClick={clearData}>
						Clear DB
					</Button>
				</Col>
			</Row>
			<Modal show={show} handleClose={() => setShow(false)} title="Result">
				<>
					<Modal.Patients result={modalData} />
					<Modal.Doctors result={modalData} />
					<Modal.Appointments result={modalData} />
				</>
			</Modal>
		</>
	);
}

export default Home;
