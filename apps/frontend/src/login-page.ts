import { customElement, query, state } from "lit/decorators.js";
import { ApiService } from "./services/ApiService";
import { LitElement, css, html } from "lit";
import { commonStyles } from "./common-style";

@customElement("login-page")
export class LoginPage extends LitElement {
  static styles = [commonStyles];

  @query('input[name="email"]')
  emailEl!: HTMLInputElement;

  @query('input[name="password"]')
  passwordEl!: HTMLInputElement;

  @query('input[name="username"]')
  usernameEl!: HTMLInputElement;

  private apiService = ApiService;

  @state()
  currentMode: "login" | "register" = "login";

  render() {
    const toggleButtonText =
      this.currentMode === "login" ? "New User?" : "Existing User";
    return html`
      <!-- Light default theme -->
      <link
        rel="stylesheet"
        href="https://nordcdn.net/ds/themes/8.0.1/nord.css"
        integrity="sha384-0Cfi7HuwGy+wburyclpPdLl1Djoqk3OD3YVxD0Y6eHSe0JB0wYCq5MWjQagEwBcE"
        crossorigin="anonymous"
      />
      <style>
        @import url("https://nordcdn.net/ds/css/3.1.1/nord.min.css");
      </style>
      <form @submit=${this.handleSubmit}>
        <fieldset>
          <legend>Email</legend>
          <input type="email" name="email" />
        </fieldset>
        ${this.currentMode === "register"
          ? html`
              <fieldset>
                <legend>Username</legend>
                <input type="text" name="username" />
              </fieldset>
            `
          : ""}
        <fieldset>
          <legend>Password</legend>
          <input type="password" name="password" />
        </fieldset>
        <input type="submit" value="Submit" />
        <button type="button" @click=${this.toggleMode}>
          ${toggleButtonText}
        </button>
      </form>
    `;
  }

  toggleMode() {
    if (this.currentMode === "login") {
      this.currentMode = "register";
    } else {
      this.currentMode = "login";
    }
  }

  async handleSubmit(e: SubmitEvent) {
    console.log(e.type);
    e.preventDefault();
    e.stopPropagation();
    if (this.currentMode === "register") {
      await this.apiService.register(
        this.emailEl.value,
        this.usernameEl.value,
        this.passwordEl.value
      );
      return false;
    }
    await this.apiService.login(this.emailEl.value, this.passwordEl.value);
    return false;
  }
}
