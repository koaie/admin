import { writable } from "svelte/store";
import ky from "ky";

export const user = writable(null);
export const authenticating = writable(true);
export const logout = () => {
  localStorage.removeItem("user");
  authenticate();
};

export function auth() {
  const at = getCredentials().at;
  return ky.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set("Authorization", `Bearer ${at}`);
        },
      ],
    },
  });
}
export const login = async (email, password) => {
  authenticating.set(true);
  const path = `${import.meta.env.VITE_API_URL}/auth/login`;
  const body = {
    json: {
      email: email,
      password: password,
    },
  };

  await ky
    .post(path, body)
    .json()
    .then((res) => {
      const tokens = res.tokens;
      if (tokens.at) {
        storeCredentials(tokens);
      }
    })
    .catch((err) => {
      authenticating.set(false);
      console.error(err);
    });
  authenticate();
};

authenticate();

async function authenticate() {
  const tokens = getCredentials();
  if (tokens) {
    const verify = ky.extend({
      hooks: {
        beforeRequest: [
          (request) => {
            request.headers.set("Authorization", `Bearer ${tokens.at}`);
          },
        ],
      },
    });
    await verify
      .get(`${import.meta.env.VITE_API_URL}/auth/verify`)
      .json()
      .then((res) => {
        if (!res.admin) {
          logout();
        }
        user.set(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    user.set(null);
  }
  authenticating.set(false);
}

export function getCredentials() {
  const cred = localStorage.getItem("user");
  return cred && JSON.parse(cred);
}

function storeCredentials(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
