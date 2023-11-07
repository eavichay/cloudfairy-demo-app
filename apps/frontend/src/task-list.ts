import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ApiService } from "./services/ApiService";
import { commonStyles } from "./common-style";

@customElement("task-list")
export class TaskLists extends LitElement {
  static styles = [
    commonStyles,
    css`
      @import url("https://nordcdn.net/ds/css/3.1.1/nord.min.css");
      th {
        text-align: start;
        height: 4rem;
      }
      table {
        width: 100%;
      }
      th[data-title="title"] {
        width: 25%;
      }
      th[data-title="description"] {
      }
      th[data-title="status"] {
        width: 2rem;
      }

      td[data-title="actions"],
      th[data-title="actions"] {
        text-align: end;
        width: 10rem;
      }
    `,
  ];

  @state()
  currentEditingTask?: {
    _id: string;
    title: string;
    description: string;
    isComplete: boolean;
  };

  @property({ type: Array })
  taskItems: any[] = [];

  @property({ type: Object })
  taskList: any = {};

  @query("dialog")
  dialogEl!: HTMLDialogElement;

  protected updated(
    p: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(p);
    if (p.has("currentEditingTask")) {
      if (this.currentEditingTask) {
        this.dialogEl.showModal();
        this.dialogEl.addEventListener(
          "close",
          () => {
            this.currentEditingTask = undefined;
          },
          {
            once: true,
          }
        );
      } else {
        this.dialogEl.close();
      }
    }
  }

  protected render() {
    return html`
      <dialog>
        <form @submit=${this.handleUpdateTask}>
          <fieldset>
            <legend>Title</legend>
            <input
              name="title"
              type="text"
              value=${this.currentEditingTask?.title}
            />
          </fieldset>
          <fieldset>
            <legend>Description</legend>
            <input
              name="description"
              type="text"
              value=${this.currentEditingTask?.description}
            />
          </fieldset>
          <input type="submit" />
          <button @click=${() => (this.currentEditingTask = undefined)}>
            Cancel
          </button>
        </form>
      </dialog>
      <div class="task-list" data-tasklist-id="${this.taskList.id}">
        <table>
          <thead>
            <th data-title="title">Title</th>
            <th data-title="description">Description</th>
            <th data-title="status">Status</th>
            <th data-title="actions">
              <button @click=${this.createNewTask}>+ Create</button>
            </th>
          </thead>
          <tbody>
            ${repeat(
              this.taskItems,
              (task: any) => task.id,
              (task) => html`
                <tr>
                  <td data-title="title">${task.title}</td>
                  <td data-title="description">${task.description}</td>
                  <td data-title="status">
                    ${task.isComplete ? html`&check;` : ""}
                  </td>
                  <td data-title="actions">
                    <button
                      ?hidden=${!task.isComplete}
                      @click=${() => this.reopen(task)}
                    >
                      Reopen
                    </button>
                    <button
                      ?hidden=${task.isComplete}
                      @click=${() => this.markAsDone(task)}
                    >
                      Done
                    </button>
                    <button @click=${() => (this.currentEditingTask = task)}>
                      Edit
                    </button>
                    <button @click=${() => this.deleteTask(task)}>
                      &#x1F5D1;
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  private async markAsDone(task: { _id: string; isComplete: boolean }) {
    const { isComplete } = await ApiService.updateCompletion({
      _id: task._id,
      isComplete: true,
    });
    task.isComplete = isComplete;
    this.requestUpdate();
  }

  private async reopen(task: { _id: string; isComplete: boolean }) {
    const { isComplete } = await ApiService.updateCompletion({
      _id: task._id,
      isComplete: false,
    });
    task.isComplete = isComplete;
    this.requestUpdate();
  }

  private createNewTask() {
    this.currentEditingTask = {
      _id: "",
      description: "",
      isComplete: false,
      title: "",
    };
  }

  private deleteTask(task: { title: string; _id: string }) {
    ApiService.deleteTask(task);
  }

  private async handleUpdateTask(e: SubmitEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.currentEditingTask) return false;
    const formData = new FormData(e.target as HTMLFormElement);
    if (!this.currentEditingTask._id && this.taskList.id) {
      // submit as new
      const newTask = await ApiService.createNewTask({
        taskListId: this.taskList.id,
        description: (formData.get("description") || "").toString(),
        title: (formData.get("title") || "").toString(),
      });
      if (newTask) {
        this.taskItems.push(newTask);
      }
      this.currentEditingTask = undefined;
      this.requestUpdate();
      return;
    }
    const resultTask = await ApiService.updateTask({
      _id: this.currentEditingTask._id,
      description: (formData.get("description") || "").toString(),
      title: (formData.get("title") || "").toString(),
    });
    const { title, description } = resultTask;
    Object.assign(this.currentEditingTask, { title, description });
    this.requestUpdate();
    this.dialogEl.close();
  }
}
