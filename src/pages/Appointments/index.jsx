import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import Modal from '../../components/Modal';
import useStorage from '../../hooks/useStorage';
import useWebsocket from '../../hooks/useWebsocket';
import range from '../../utils/common.utils';

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

	const getColor = (item, appointments) => {
		const newArr = appointments?.filter(
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
			return 'red';
		}

		if (newArr.length > 1) {
			return 'yellow';
		}

		return 'green';
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
				} = await axios.get('api/hospital/appointments');

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

	const getTime = (doctorsTime, patientTime, arr, step = 0) => {
		if (step === 10) return arr;

		for (const app of arr) {
			if (
				app.timeStart &&
				app.timeStart in doctorsTime[app.doctor] &&
				doctorsTime[app.doctor][app.timeStart].length <= 1 &&
				app.timeStart in patientTime[app.patient] &&
				patientTime[app.patient][app.timeStart].length <= 1
			) {
				if (patientTime[app.patient][app.timeStart].length === 0) {
					patientTime[app.patient][app.timeStart].push(app.doctor);
				}

				if (doctorsTime[app.doctor][app.timeStart].length === 0) {
					doctorsTime[app.doctor][app.timeStart].push(app.patient);
				}
				// eslint-disable-next-line no-continue
				continue;
			}

			for (const i of range(
				app.patientDetails.timeStart,
				app.patientDetails.timeEnd,
			)) {
				if (
					i in doctorsTime[app.doctor] &&
					doctorsTime[app.doctor][i].length === 0 &&
					patientTime[app.patient][i].length === 0
				) {
					doctorsTime[app.doctor][i].push(app.patient);
					patientTime[app.patient][i].push(app.doctor);
					app.timeStart = i;
					break;
				}
			}
		}

		const redApp = arr.filter(
			(app) => !['blue', 'green'].includes(getColor(app, arr)),
		);
		if (redApp.length > 0) {
			redApp.forEach((app) => {
				let doctorChange = false;
				let patientChange = false;

				Object.keys(doctorsTime[app.doctor]).forEach((key) => {
					if (doctorsTime[app.doctor][key].includes(app.patient)) {
						doctorsTime[app.doctor][key].filter((pat) => pat !== app.patient);
						doctorChange = true;
					}
				});

				Object.keys(patientTime[app.patient]).forEach((key) => {
					if (patientTime[app.patient][key].includes(app.doctor)) {
						patientTime[app.patient][key].filter((doc) => doc !== app.doctor);
						patientChange = true;
					}
				});

				if (!doctorChange && !patientChange) {
					// eslint-disable-next-line no-param-reassign
					doctorsTime[app.doctor] = Object.keys(doctorsTime[app.doctor]).reduce(
						(obj, time) => ({ ...obj, [time]: [] }),
						{},
					);
					// eslint-disable-next-line no-param-reassign
					patientTime[app.patient] = Object.keys(
						patientTime[app.patient],
					).reduce((obj, time) => ({ ...obj, [time]: [] }), {});
				}
			});

			return getTime(doctorsTime, patientTime, arr, step + 1);
		}

		return arr;
	};

	useEffect(() => {
		const doctorsTime = {};
		const patientTime = {};

		oldAppointment.forEach((el) => {
			if (!(el.doctor in doctorsTime)) {
				doctorsTime[el.doctor] = [
					...range(el.doctorDetails.timeStart, el.doctorDetails.timeEnd),
				].reduce((obj, i) => ({ ...obj, [i]: [] }), {});
			}
			if (el.timeStart in doctorsTime[el.doctor])
				doctorsTime[el.doctor][el.timeStart].push(el.patient);
		});

		oldAppointment.forEach((el) => {
			if (!(el.patient in patientTime)) {
				patientTime[el.patient] = [
					...range(el.patientDetails.timeStart, el.patientDetails.timeEnd),
				].reduce((obj, i) => ({ ...obj, [i]: [] }), {});
			}
			if (el.timeStart in patientTime[el.patient])
				patientTime[el.patient][el.timeStart].push(el.doctor);
		});

		setNewAppointment(getTime(doctorsTime, patientTime, oldAppointment));
	}, [oldAppointment]);

	const updateData = async () => {
		await axios.delete('api/hospital');
		await axios.post('api/hospital', newAppointment);
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
								oldAppointment.map((item) => {
									const color = getColor(item, oldAppointment);

									return (
										<tr>
											<td style={{ backgroundColor: color }}>{item.patient}</td>
											<td style={{ backgroundColor: color }}>{item.doctor}</td>
											<td style={{ backgroundColor: color }}>
												{item.timeStart}
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					{Object.entries(
						oldAppointment
							.map((item) => getColor(item, oldAppointment))
							.reduce(
								(obj, item) => {
									// eslint-disable-next-line no-param-reassign
									obj[item] += 1;
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
								newAppointment.map((item) => {
									const color = getColor(item, newAppointment);

									return (
										<tr
											onClick={() =>
												openViewCard(
													item.patientDetails,
													item.doctorDetails,
													item.timeStart,
												)
											}
										>
											<td style={{ backgroundColor: color }}>{item.patient}</td>
											<td style={{ backgroundColor: color }}>{item.doctor}</td>
											<td style={{ backgroundColor: color }}>
												{item.timeStart}
												<span className="float-end">View Card</span>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
					{Object.entries(
						newAppointment
							.map((item) => getColor(item, oldAppointment))
							.reduce(
								(obj, item) => {
									// eslint-disable-next-line no-param-reassign
									obj[item] += 1;
									return obj;
								},
								{ red: 0, blue: 0, yellow: 0, green: 0 },
							),
					).reduce((str, item) => `${str}, ${item[0]}: ${item[1]} `, '')}
				</Col>
			</Row>
			<Row className="justify-content-end pt-5">
				<Col xs="auto">
					<Button variant="success" onClick={updateData}>
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
