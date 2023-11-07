import { css } from "lit";

export const commonStyles = css`
  dialog {
    min-width: 80%;
  }
  form {
    width: 50%;
    margin: 0 auto;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  fieldset:focus-within {
    background: var(--n-color-nav-hover);
  }
  fieldset {
    margin: 0;
    padding: 1rem 1rem 0.5rem 1rem;
  }
  input {
    width: 100%;
    min-height: 2rem;
  }
  button {
    min-height: 2rem;
  }

  header {
    padding: 1rem;
    box-sizing: border-box;
    background: var(--n-color-text-progress);
    display: flex;
    width: 100%;
    align-items: center;
  }
  header .spacer {
    flex-grow: 1;
  }
  header h1 {
    display: inline-block;
    color: var(--n-color-text-on-accent);
    margin-inline-end: 1rem;
  }

  th,
  td {
    border: none;
  }
`;
