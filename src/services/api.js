const BASE_URL = "http://127.0.0.1:5000";

// axios
function request(...args) {
  return fetch(...args).then((response) => response.json());
}

export function fetchTasks(robotId, time) {
  return request(BASE_URL + `/get_task?robotid=${robotId}&time=${time}`);
}

// export function fetchRobotInfo(robotId) {
//   return request(BASE_URL + `/get_robotinfo/${robotId}`);
// }
