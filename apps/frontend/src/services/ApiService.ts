const ENDPOINT = "http://bff.localhost:8000";

const FETCH_DEFAULTS = (): RequestInit => ({
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Token " + localStorage.getItem("todo-token") || "",
  },
  mode: "cors",
});

class ApiServiceClass extends EventTarget {
  user: any = null;
  token: string = localStorage.getItem("todo-token") || "";

  async autoLogin() {
    const res = await fetch(`${ENDPOINT}/user`, {
      method: "GET",
      ...FETCH_DEFAULTS(),
    });
    const { user } = await res.json();
    if (user) {
      this.user = user;
      this.token = this.user.token;
    }
    this.dispatchEvent(new CustomEvent("auth", { detail: this.user }));
  }

  async logout() {
    localStorage.removeItem("todo-token");
    this.token = "";
    this.user = null;
    this.dispatchEvent(new CustomEvent("auth", { detail: this.user }));
  }

  async register(email: string, username: string, password: string) {
    const res = await fetch(`${ENDPOINT}/user/register`, {
      method: "POST",
      ...FETCH_DEFAULTS(),
      body: JSON.stringify({ user: { email, password, username } }),
    });
    const data = await res.json();
    this.user = data.user;
    if (this.user?.token) {
      this.token = this.user.token;
      localStorage.setItem("todo-token", this.user.token);
    }
    this.dispatchEvent(new CustomEvent("auth", { detail: this.user }));
    return this.user;
  }

  async login(email: string, password: string) {
    const res = await fetch(`${ENDPOINT}/user/login`, {
      method: "POST",
      ...FETCH_DEFAULTS(),
      body: JSON.stringify({ user: { email, password } }),
    });
    const data = await res.json();
    this.user = data.user;
    this.dispatchEvent(new CustomEvent("auth", { detail: this.user }));
    if (this.user?.token) {
      this.token = this.user.token;
      localStorage.setItem("todo-token", this.user.token);
    }
    return this.user;
  }

  async getTasks() {
    const res = await fetch(`${ENDPOINT}/tasklists`, {
      ...FETCH_DEFAULTS(),
    });
    const { taskLists = [] } = await res.json();
    return taskLists;
  }

  async deleteList(list: { id: string }) {
    await fetch(`${ENDPOINT}/tasklists/${list.id}`, {
      method: "DELETE",
      ...FETCH_DEFAULTS(),
    });
    this.dispatchEvent(new CustomEvent("task-deleted"));
  }

  async updateCompletion(updatedTask: { _id: string; isComplete: boolean }) {
    const res = await fetch(`${ENDPOINT}/task/completion/${updatedTask._id}`, {
      method: "POST",
      ...FETCH_DEFAULTS(),
      body: JSON.stringify({ isComplete: updatedTask.isComplete }),
    });
    const { task } = await res.json();
    return task;
  }

  async deleteTask(task: { _id: string }) {
    await fetch(`${ENDPOINT}/task/${task._id}`, {
      method: "DELETE",
      ...FETCH_DEFAULTS(),
    });
    this.dispatchEvent(new CustomEvent("task-deleted"));
  }

  async createTaskList(data: { title: string }) {
    const res = await fetch(`${ENDPOINT}/tasklists`, {
      method: "POST",
      ...FETCH_DEFAULTS(),
      body: JSON.stringify({
        title: data.title,
      }),
    });
    this.dispatchEvent(new CustomEvent("task-deleted"));
  }

  async createNewTask(data: {
    title: string;
    description: string;
    taskListId: string;
  }) {
    const res = await fetch(`${ENDPOINT}/tasklists/${data.taskListId}`, {
      method: "POST",
      ...FETCH_DEFAULTS(),
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    });
    const { task } = await res.json();
    return task;
  }

  async updateTask(updatedTask: {
    _id: string;
    title: string;
    description: string;
  }) {
    const res = await fetch(`${ENDPOINT}/task/${updatedTask._id}`, {
      method: "POST",
      ...FETCH_DEFAULTS(),
      body: JSON.stringify({
        title: updatedTask.title,
        description: updatedTask.description,
      }),
    });
    const { task } = await res.json();
    return task;
  }
}

export const ApiService = new ApiServiceClass();
