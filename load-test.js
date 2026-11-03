import http from "k6/http";
import { check, sleep } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  vus: 3000, // Simulates 100 users hitting the API at the exact same time
  duration: "300s", // Bombards the endpoint continuously for 15 seconds
};

export default function () {
  const url = "http://127.0.0.1:3000/api/v1/auth/AccountCreation";

  // Generating a random UUID for each request to act as a unique customer
  const payload = JSON.stringify({
    customer_id: uuidv4(),
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  // Validate the backend didn't crash and returned your 200 OK
  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(0.05); // Tiny 50ms pause so we don't completely choke your local OS network ports
}
