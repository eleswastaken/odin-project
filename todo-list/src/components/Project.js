


export default function ProjectComponent(project) {

	const wrapper = document.createElement("div");
	const h1 = document.createElement('h1');
	const ul = document.createElement('ul');


	h1.innerHTML = project.title

	wrapper.appendChild(h1)
	wrapper.appendChild(ul)


	project.tasks.forEach(t => {
		ul.appendChild(task(t))
	})

	wrapper.id = 'project-page';

	return wrapper;
}

function task(t) {
	const li = document.createElement('li')
	li.innerHTML = `
		<div class='task'>
			<span class="priority"></span>
			<input type="checkbox" name="" id="" ${t.isComplete ? 'checked':""}>
			<p>${t.title}</p>
			<button class="edit-task"></button>
			<button class="delete-task"></button>
		</div>
	`;

	return li
}