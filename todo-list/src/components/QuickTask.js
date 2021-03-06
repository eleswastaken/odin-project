
import state from "../state.js";
import Todo from "../todo-factory.js";

export default function QuickTask(project, rerender) {
    
    const wrapper = document.createElement("div");
    let projectIsGiven = project ? true : false;

    wrapper.id = 'quick-task';

    let html = `
        <form>
			<span class="priority"></span>
            <label class='checkbox'><input name='isComplete' type="checkbox"></label>
            
            <label class='input'><input name='title' type="text" placeholder="New Task..."/></label>
            ${!project ? `
            <div class="project-dropdown" >
                <button name='project' data-value='${state.projects[0].title}' class="select-project" aria-expanded="false">${state.projects[0].title}</button>
                <ul class='project-options'></ul>
            </div>
            ` : ''}
            <select name='priority'>
                <option value='0'>None</option>
                <option value='1'>!</option>
                <option value='2'>!!</option>
                <option value='3' selected>!!!</option>
            </select>
            <button type='submit' class="plus">+</button>
        </form>
    `;
    wrapper.innerHTML = html;

    function render() {
        try{
            let ul = wrapper.querySelector('.project-options')
            ul.innerHTML = state.projects.map(p => {
                return `<li><button data-value='${p.title}' class='project-option'>${p.title}</button></li>`
            }).join('');

            wrapper.querySelector('.select-project').addEventListener('click', function(event) {
                if (event.explicitOriginalTarget !== this) return 
                event.preventDefault()
                wrapper.querySelector('.select-project').setAttribute("aria-expanded", true)
                function open(event) {
                    if (event.target.className !== "project-option" && event.target !== wrapper.querySelector('.select-project')) {
                        wrapper.querySelector('.select-project').setAttribute("aria-expanded", false)
                        document.removeEventListener('click', open)
                    }
                }
                document.addEventListener('click', open)
            })
            wrapper.querySelectorAll('.project-option').forEach(opt => {
                opt.addEventListener('click', function(event) {
                    event.preventDefault()
                    wrapper.querySelector('.select-project').dataset.value = this.dataset.value;
                    wrapper.querySelector('.select-project').innerHTML = this.dataset.value;
                    wrapper.querySelector('.select-project').setAttribute("aria-expanded", false)
                })
            })
        } catch (err) {
            console.info(err)
        }
    }

    
    wrapper.querySelector("form").onsubmit = function(event) {
        event.preventDefault()
        project = !project
            ? state.projects.find(p => this.project.dataset.value === p.title)
            : project;
        project.addTask(
            Todo(
                this.title.value.trim() ? this.title.value : "New Task",
                undefined,
                this.priority.value,
                this.isComplete.checked,
                project.title,
            )
        );
        this.title.value = '';
        rerender()
        state.saveState()
        project = projectIsGiven ? project : null;
    }

    render()
    wrapper.render = render;
    return wrapper
}

// bug: the checked='' attribute is not being added to the input, 
// but the 'checked' value changes