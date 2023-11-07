import { ApiService } from "./services/ApiService";

import "./login-page";
import "./todo-lists";
import { LitElement, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { commonStyles } from "./common-style";

@customElement("todo-app")
export class RootApp extends LitElement {
  static styles = [commonStyles];

  @state()
  private user: any;
  private apiService = ApiService;

  @query("dialog")
  dialogEl!: HTMLDialogElement;

  constructor() {
    super();
    this.apiService.addEventListener("auth", () => {
      this.user = this.apiService.user;
    });
    this.apiService.autoLogin();
  }
  render() {
    if (!this.user) {
      return html` <login-page></login-page> `;
    }
    return html` <dialog>
        <style>
          @import url("https://nordcdn.net/ds/css/3.1.1/nord.min.css");
        </style>
        <form @submit=${this.createNewList}>
          <fieldset>
            <legend>New List name</legend>
            <input name="new-list-name" type="text" />
          </fieldset>
          <input type="submit" />
          <button @click=${() => this.dialogEl.close()}>Cacnel</button>
        </form>
      </dialog>
      <header>
        <h1>Todo App</h1>
        <button @click=${this.toggleDialog}>+ Create a new list</button>
        <span class="spacer"></span>
        <button id="logout" @click=${() => this.apiService.logout()}>
          Logout
        </button>
      </header>
      <todo-lists></todo-lists>`;
  }

  toggleDialog() {
    this.dialogEl.showModal();
    (
      this.dialogEl.querySelector(
        'input[name="new-list-name"]'
      ) as HTMLInputElement
    ).value = "";
  }

  createNewList(e: SubmitEvent) {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("new-list-name") as string;
    if (!title) return;
    this.apiService.createTaskList({ title });
    this.dialogEl.close();
  }
}
