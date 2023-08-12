// Establecer la URL de la API y el nombre de usuario
const API_URL = "https://playground.4geeks.com/apis/fake/todos/user/";
const USERNAME = "antonio";

// Importar las bibliotecas necesarias de React
import React, { useState, useEffect } from "react";

// Definir el componente funcional Home
const Home = () => {
	// Definir estados utilizando el hook useState
	const [toDo, setToDo] = useState([]); // Estado para almacenar la lista de tareas
	const [loading, setLoading] = useState(true); // Estado para controlar la carga
	const [update, setUpdate] = useState({ success: false, alert: false }); // Estado para controlar las actualizaciones

	// Definir una función asíncrona para obtener la lista de tareas
	// Se utilizan funciones asíncronas para conectarnos con la API, ya que son datos que pueden tardar en llegar
	const getToDo = async () => {
		try {
			const response = await fetch(API_URL + USERNAME); //Esperamos la promesa del fetch

			if (response.ok) {
				const res = await response.json(); // Esperamos los datos en formato JSON y los guardamos
				console.log(res);
				setToDo(res); // Establecer la lista de tareas en el estado
				setLoading(false); // Cambiar el estado de carga a falso
			} else {
				setLoading(false);
			}
		} catch (error) {
			setToDo(false); // Establecer el estado de la lista de tareas como falso
			setLoading(false);
			console.log(error);
			return false;
		}
	};

	// Definir una función asíncrona para actualizar la lista de tareas
	const updateToDo = async () => {
		if (!loading) {
			try {
				const response = await fetch(API_URL + USERNAME, {
					method: "PUT",
					body: JSON.stringify(toDo),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.ok) {
					const res = await response.json();
					console.log(res);
					setUpdate({ success: true, alert: true }); // Establecer el estado de actualización como exitoso y mostrar la alerta
					setTimeout(() => setUpdate({ ...update, alert: false }), 2000); // Desactivar la alerta después de 2 segundos
				} else {
					setUpdate({ success: false, alert: true }); // Establecer el estado de actualización como fallido y mostrar la alerta
				}
			} catch (error) {
				console.log(error);
				setUpdate({ success: false, alert: true });
			}
		}
	};

	// Definir una función para manejar la entrada de texto
	const handleInput = (e) => {
		let task = { label: e.target.value, done: false };
		if (e.keyCode == 13 && task != "") {
			// Verificar si se presionó la tecla Enter
			setToDo([...toDo, task]); // Agregar la nueva tarea al estado
			e.target.value = ""; // Borrar el contenido del input
		}
	};

	// Definir una función para eliminar una tarea
	const deleteTask = (index) => {
		if (toDo.length > 1) {
			let tempArr = toDo.slice(); // Crear una copia de la lista de tareas
			tempArr = tempArr.filter((item, index2) => {
				return index2 != index; // Filtrar para mantener solo las tareas que no coincidan con el índice
			});
			setToDo(tempArr); // Actualizar la lista de tareas en el estado
		} else {
			alert("You cannot delete the only existing task in the list.");
		}
	};

	// Definir una función para marcar una tarea como completada
	const markDone = (value, index) => {
		let tempArr = toDo.slice(); // Crear una copia de la lista de tareas
		tempArr = tempArr.map((item, index2) => {
			if (index2 === index) {
				return { ...item, done: value }; // Cambiar el estado de la tarea a completada o no completada
			}
			return item;
		});
		console.log(tempArr);
		setToDo(tempArr); // Actualizar la lista de tareas en el estado
	};

	// Usar el hook useEffect para obtener la lista de tareas al montar el componente
	useEffect(() => {
		getToDo();
	}, []);

	// Usar el hook useEffect para actualizar la lista de tareas cuando el estado 'toDo' cambia
	useEffect(() => {
		updateToDo();
	}, [toDo]);

	// Renderizar el componente Home
	return (
		<div className="container text-center mt-5 caja">
			<div className="container titulo"></div>
			<h1>todos</h1>
			<div className="hojas">
				{update.alert ? update.success ? <p className="text-succes text-center">List updated!</p> : <p className="text-danger text-center">Failed to update list</p> : null}
				<div className="justify-content start mt-2 shadow p-3 mb-5 bg-body">
					<input
						type="text"
						className="form-control rounded-0"
						id="task-input"
						placeholder="What needs to be done?"
						onKeyUp={(e) => handleInput(e)} // Llamar a la función handleInput al presionar una tecla
					/>
					<div>
						<ul className="list-group list-group-flush text-center">
							{loading ? (
								<li className="add list-group-item border">Loading list...</li>
							) : toDo && toDo.length > 0 ? (
								toDo.map((item, index) => {
									return (
										<li className="d-flex justify-content-between align-items-center flex-wrap list-group-item border" key={index}>
											<span>{item.done ? <del>{item.label}</del> : item.label}</span>
											<div className="d-flex align-items-center">
												<input className="form-check-input my-done p-3 mt-0" type="checkbox" role="button" onChange={(e) => markDone(e.target.checked, index)} checked={item.done} />
												<button type="button" className="btn btn-outline-light my-trash-hover mx-2" onClick={() => deleteTask(index)}>
													<i className="fa-solid fa-trash my-trash text-danger"></i>
												</button>
											</div>
										</li>
									);
								})
							) : (
								<li className="add list-group-item border text-danger">Failed to get list...</li>
							)}
						</ul>
					</div>
					<p className="agregado">{toDo.length} items left</p>
				</div>
			</div>
		</div>
	);
};

// Exportar el componente Home
export default Home;
