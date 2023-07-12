import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import Modal from '../../components/Modal';
import useStorage from '../../hooks/useStorage';
import useWebsocket from '../../hooks/useWebsocket';

function Appointments() {
	const [cardInfo, setCardInfo] = useState({});
	const [show, setShow] = useState(false);
	const {
		oldAppointment,
		setOldAppointment,
		newAppointment,
		setNewAppointment,
	} = useStorage();
	const { subscribe, unsubscribe } = useWebsocket();

	function openViewCard(patient, doctor, timeStart) {
		setCardInfo({ patient, doctor, timeStart });
		setShow(true);
	}

	const clear = useCallback(() => {
		setOldAppointment([]);
		setNewAppointment([]);
	}, []);

	const create = useCallback((items) => {
		setOldAppointment((prev) => [...(prev || []), ...(items || [])]);
	}, []);

	const getColor = (item, data) => {
		const arr = data?.filter(
			(obj) =>
				(obj.doctor === item.doctor && obj.timeStart === item.timeStart) ||
				(obj.patient === item.patient && obj.timeStart === item.timeStart),
		);

		if (
			item.timeStart < item.doctorDetails.timeStart ||
			item.timeStart >= item.doctorDetails.timeEnd ||
			item.timeStart < item.patientDetails.timeStart ||
			item.timeStart >= item.patientDetails.timeEnd ||
			!item.timeStart
		) {
			// eslint-disable-next-line no-param-reassign
			item.color = 'red';
		} else if (arr.length > 1) {
			// eslint-disable-next-line no-param-reassign
			item.color = 'yellow';
		} else {
			// eslint-disable-next-line no-param-reassign
			item.color = 'green';
		}
		return item;
	};

	useEffect(() => {
		subscribe('clear', clear);
		subscribe('create', create);

		(async () => {
			const limit = 100;
			let skip = 0;
			const items = [];
			let total = 0;

			do {
				const {
					data: { total: appointmentTotal, items: appointments },
					// eslint-disable-next-line no-await-in-loop
				} = await axios.get('api/hospital/appointments', {
					params: { skip, limit },
				});

				Array.prototype.push.apply(items, appointments);

				total = appointmentTotal;
				skip += limit;
			} while (total > skip + limit);

			setOldAppointment(items);
		})();
		return () => {
			unsubscribe('clear', clear);
			unsubscribe('create', create);
		};
	}, []);

	const getColorCombination = (item, appointments) => {
		const checkUser = appointments.some(
			(value) =>
				value.timeStart === item.timeStart &&
				(value.doctor === item.doctor || value.patient === item.patient),
		);

		if (!checkUser) {
			// eslint-disable-next-line no-param-reassign
			item.color = item.timeStart === item.oldTimeStart ? 'green' : 'blue';
			appointments.push(item);
		} else {
			// eslint-disable-next-line no-param-reassign
			item.color = 'red';
		}
		return item;
	};

	const getAllTimeAppointments = (appointments) => {
		appointments.forEach((item) => {
			const allCombinations = [];
			const timeStart =
				item.doctorDetails.timeStart >= item.patientDetails.timeStart
					? item.doctorDetails.timeStart
					: item.patientDetails.timeStart;
			const timeEnd =
				item.doctorDetails.timeEnd <= item.patientDetails.timeEnd
					? item.doctorDetails.timeEnd
					: item.patientDetails.timeEnd;

			for (let i = timeStart; i < timeEnd; i++) {
				allCombinations.push(i);
			}
			// eslint-disable-next-line no-param-reassign
			item.combinations = allCombinations;
		});

		const allCombinations = [];
		function generateCombinations(
			// eslint-disable-next-line no-shadow
			appointments,
			currentIndex = 0,
			combinationArr = [],
		) {
			if (currentIndex === appointments.length) {
				const arr = [];
				Array.prototype.push.apply(allCombinations, [
					combinationArr.map((item) => getColorCombination(item, arr)),
				]);
				return;
			}

			const currentData = appointments[currentIndex].combinations;

			for (let i = 0; i < currentData.length; i++) {
				const result = {
					patient: appointments[currentIndex].patient,
					doctor: appointments[currentIndex].doctor,
					timeStart: currentData[i],
					oldTimeStart: appointments[currentIndex].timeStart,
				};
				combinationArr.push(result);

				generateCombinations(appointments, currentIndex + 1, combinationArr);

				combinationArr.pop();
			}
		}

		generateCombinations(appointments);
		return allCombinations;
	};

	const resolveConflictingAppointments = (appointments) => {
		const allTimeAppointments = getAllTimeAppointments(appointments);
		const sortCombination = allTimeAppointments.sort((a, b) => {
			if (
				a.filter((item) => item.color === 'red').length <
				b.filter((item) => item.color === 'red').length
			) {
				return -1;
			}
			if (
				a.filter((item) => item.color === 'red').length >
				b.filter((item) => item.color === 'red').length
			) {
				return 1;
			}
			if (
				a.filter((item) => item.color === 'green').length >
				b.filter((item) => item.color === 'green').length
			) {
				return -1;
			}
			if (
				a.filter((item) => item.color === 'green').length <
				b.filter((item) => item.color === 'green').length
			) {
				return 1;
			}
			return 0;
		});

		return sortCombination[0];
	};

	useEffect(() => {
		oldAppointment.forEach((item) => getColor(item, oldAppointment));

		setNewAppointment(
			resolveConflictingAppointments(
				JSON.parse(JSON.stringify(oldAppointment)),
			).sort((a, b) => {
				if (b.patient > a.patient) return -1;
				if (b.patient < a.patient) return 1;

				if (b.doctor > a.doctor) return -1;
				if (b.doctor < a.doctor) return 1;

				if (a.timeStart && b.timeStart && b.timeStart > a.timeStart) return -1;
				if (a.timeStart && b.timeStart && b.timeStart < a.timeStart) return 1;

				return 0;
			}),
		);
	}, [oldAppointment]);

	const updateData = async (appointments) => {
		await axios.put('api/hospital/appointments', { appointments });
	};

	return (
		<div>
			<Row className="mt-5">
				<Col>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Patient</th>
								<th>Doctor</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>
							{oldAppointment &&
								oldAppointment.map((item) => (
									<tr key={`${item.doctor}_${item.patient}_${item.timeStart}`}>
										<td style={{ backgroundColor: item.color }}>
											{item.patient}
										</td>
										<td style={{ backgroundColor: item.color }}>
											{item.doctor}
										</td>
										<td style={{ backgroundColor: item.color }}>
											{item.timeStart}
										</td>
									</tr>
								))}
						</tbody>
					</Table>
					{Object.entries(
						oldAppointment.reduce(
							(obj, item) => {
								// eslint-disable-next-line no-param-reassign
								obj[item.color] += 1;
								return obj;
							},
							{ red: 0, blue: 0, yellow: 0, green: 0 },
						),
					).reduce((str, item) => `${str}, ${item[0]}: ${item[1]} `, '')}
				</Col>

				<Col>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Patient</th>
								<th>Doctor</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>
							{newAppointment &&
								newAppointment.map((item) => (
									<tr
										key={`${item.doctor}_${item.patient}_${item.timeStart}`}
										onClick={() =>
											openViewCard(
												item.patientDetails,
												item.doctorDetails,
												item.timeStart,
											)
										}
									>
										<td style={{ backgroundColor: item.color }}>
											{item.patient}
										</td>
										<td style={{ backgroundColor: item.color }}>
											{item.doctor}
										</td>
										<td style={{ backgroundColor: item.color }}>
											{item.timeStart}
											<span className="float-end">View Card</span>
										</td>
									</tr>
								))}
						</tbody>
					</Table>
					{Object.entries(
						newAppointment.reduce(
							(obj, item) => {
								// eslint-disable-next-line no-param-reassign
								obj[item.color] += 1;
								return obj;
							},
							{ red: 0, blue: 0, yellow: 0, green: 0 },
						),
					).reduce((str, item) => `${str}, ${item[0]}: ${item[1]} `, '')}
				</Col>
			</Row>
			<Row className="justify-content-end pt-5">
				<Col xs="auto">
					<Button variant="success" onClick={() => updateData(newAppointment)}>
						Save Data
					</Button>
				</Col>
			</Row>
			<Modal
				show={show}
				handleClose={() => setShow(false)}
				title="Appointment Card"
			>
				<Modal.ViewCard data={cardInfo} />
			</Modal>
		</div>
	);
}

export default Appointments;
