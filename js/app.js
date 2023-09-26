document.addEventListener('DOMContentLoaded', function () {
	/* Variaveis Globais */
    
	const openModal = document.querySelectorAll('[data-open]');
	const closeModal = document.querySelectorAll('[data-close]');

	const isVisible = 'is-visible';

	const btnTask = document.querySelector('#add__task');
	const taskTitle = document.querySelector('#todo1');

	const containerAlert = document.querySelector('#alert__empty');

	const todoContainer = document.querySelector('.to-do');

	const containerDrop = document.querySelectorAll('.dropzone');
	let draggableTodo = null;

	let tasks = [];

	/* Funções */
    
	const TodoTaskContainer = (task) => {
		const $div = document.createElement('div');
		const $p = document.createElement('p');
		const $button = document.createElement('button');

		$div.classList.add('container__todo');
		$div.classList.add('card');
		$div.setAttribute('id', task.getId());

		/* Realiza e cria o evento */
        
		$div.setAttribute('draggable', 'true');

		$div.addEventListener('dragstart', dragStart);
		$div.addEventListener('dragend', dragEnd);

		function dragStart() {
			draggableTodo = this;
		}

		function dragEnd() {
			draggableTodo = null;
		}

		containerDrop.forEach((status) => {
			status.addEventListener('dragover', dragOver);
			status.addEventListener('dragenter', dragEnter);
			status.addEventListener('dragleave', dragLeave);
			status.addEventListener('drop', dragDrop);
		});

		function dragOver(e) {
			e.preventDefault();
		}

		function dragEnter() {
			this.style.border = '5px solid yellow';
		}

		function dragLeave() {
			this.style.border = 'none';
		}

		function dragDrop() {
			if (this.classList.contains('doing')) {
				draggableTodo.style.background = 'red';
			} else if (this.classList.contains('done')) {
				draggableTodo.style.background = 'green';
			} else {
				draggableTodo.style.background = '#457b9d';
			}

			this.style.border = 'none';
			this.appendChild(draggableTodo);
		}
		/* Fim da criação do evento */

		$p.innerHTML = `${task.getName()}`;

		$button.innerHTML = 'X';
		$button.classList.add('remove__button');

		// Remover tarefa quando pressiona o botao X
		$button.addEventListener('click', (e) => {
			// Remover do campo DOM
			removeTodo($div.getAttribute('id'));

			// Remover do ARRAY
			removeFromArray(e);
		});

		$div.appendChild($p);
		$div.appendChild($button);

		return $div;
	};

	const removeTodo = (id) => {
		document.getElementById(id).remove();
	};

	const removeFromArray = (e) => {
		let index;
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i].name === e.target.parentElement.childNodes[0].innerHTML) {
				index = i;
			}
		}

		tasks.splice(index, 1);
	};

	// Campo MODAL
	// Itere todos os conjuntos de dados abertos e defina a classe 'is-visible'
	for (let elem of openModal) {
		elem.addEventListener('click', function () {
			const modalId = this.dataset.open;
			document.getElementById(modalId).classList.add(isVisible);
		});
	}

	// Itere todos os conjuntos de dados próximos e remova a classe 'is-visible'
	for (let elem of closeModal) {
		elem.addEventListener('click', function () {
			this.parentElement.parentElement.parentElement.classList.remove(isVisible);
		});
	}

	// Adiciona o evento para o botao X para fechar o modal (de modo que fique invisivel)
	document.addEventListener('click', (e) => {
		if (e.target == document.querySelector('.modal.is-visible')) {
			document.querySelector('.modal.is-visible').classList.remove(isVisible);

			containerAlert.classList.remove('alert');
		}
	});

	// Adiciona a tecla ESC para fechar o modal tambem
	document.addEventListener('keyup', (e) => {
		if (e.key === 'Escape' && document.querySelector('.modal.is-visible')) {
			document.querySelector('.modal.is-visible').classList.remove(isVisible);
			containerAlert.classList.remove('alert');
		}
	});

	// Criar tarefa e Anexar
	// Recuperando valor e gerenciando os erros
	btnTask.addEventListener('click', function (e) {
		e.preventDefault();

		if (taskTitle.value === '') {
			containerAlert.classList.add('alert');
			containerAlert.innerHTML = 'O valor inserido nao pode ser vazio!';
			containerAlert.style.display = 'block';

			setTimeout(() => {
				containerAlert.style.display = 'none';
			}, 2000);
			return;
		} else {
			document.querySelector('.modal.is-visible').classList.remove(isVisible);

			// Evitar mais do que 6 tarefas
			if (tasks.length < 6) {
				// Criar uma nova instancia de tarefa
				const task = new Task(taskTitle.value);

				// Adicionando a tarefa ao array para controlar o número de tarefas
				tasks.push(task);

				// Mostrar a tarefa no aplicativo
				todoContainer.appendChild(TodoTaskContainer(task));
			} else {
				containerAlert.classList.add('alert');
				containerAlert.innerHTML = 'Você chegou ao maximo de tarefas permitidas, delete algumas tarefas!';
				containerAlert.style.display = 'block';
				return;
			}
		}
	});
});
