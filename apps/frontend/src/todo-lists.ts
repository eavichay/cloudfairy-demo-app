import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ApiService } from "./services/ApiService";
import { repeat } from "lit/directives/repeat.js";

import "./task-list";

@customElement("todo-lists")
export class TodoLists extends LitElement {
  static styles = [
    css`
      @import url("https://nordcdn.net/ds/css/3.1.1/nord.min.css");
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
      }
      .list {
        padding: 1rem;
      }
      .list-id {
        font-size: 1.667rem;
        margin-block-end: 0.5rem;
        display: inline-block;
      }
    `,
  ];

  @state()
  todoLists: any[] = [];

  private apiService = ApiService;

  connectedCallback(): void {
    super.connectedCallback();
    this.apiService.getTasks().then((r) => {
      this.todoLists = r;
      console.log(r);
    });
    this.apiService.addEventListener(
      "task-deleted",
      () => this.connectedCallback(),
      {
        once: true,
      }
    );
  }

  render() {
    return html`
      ${repeat(
        this.todoLists,
        (list) => list.id,
        (list) => html`
          <div class="list">
            <span class="list-id">${list.title} (${list.tasks.length})</span>
            ${list.tasks.length === 0
              ? html`<button @click=${() => this.deleteList(list)}>
                  &#x1F5D1;
                </button>`
              : ""}
            <task-list .taskList=${list} .taskItems=${list.tasks} />
          </div>
        `
      )}
    `;
  }

  async deleteList(list: { id: string }) {
    this.apiService.deleteList(list);
  }
}
