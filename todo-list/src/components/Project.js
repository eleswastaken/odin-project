
import {sortByPriority, sortByDateDone, sortByDate, sortByComplete} from "../sort.js"
import QuickTask from './QuickTask.js'
import Task from './Task.js'

export default function ProjectComponent(project, rerender) {
    const wrapper = document.createElement("div");
    const h1 = document.createElement("h1");
    const ul = document.createElement("ul");
    const backBtn = document.createElement("button");
    const msg = document.createElement("h2");
    wrapper.id = "project-page";

    backBtn.onclick = () => {
        document.body.style.overflow = "auto";
        wrapper.remove();
        rerender();
    };

    backBtn.innerHTML = "<";
    backBtn.className = "back";
    wrapper.appendChild(backBtn);

    h1.innerHTML = project.title;

    wrapper.appendChild(h1);
    wrapper.appendChild(QuickTask(project, renderUl));

    msg.className = "msg"
    msg.innerHTML = "No tasks Here!";
    
    function renderUl() {
        ul.innerHTML = "";
        if (!project.tasks.length) {
            wrapper.appendChild(msg);
        } else {
            msg.remove()
            wrapper.appendChild(ul);
            
            let done = sortByDateDone(sortByComplete(project.tasks)[1]);
            let undone = sortByPriority(
                sortByDate(sortByComplete(project.tasks)[0])
            );

            undone.forEach((t) => {
                ul.appendChild(Task(t, renderUl, project));
            });
            ul.lastElementChild.classList.add("last-active")
            done.forEach((t) => {
                ul.appendChild(Task(t, renderUl, project));
            });
        }
    }
    renderUl();

    return wrapper;
}
