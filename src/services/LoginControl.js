import Repository from "./Repository";
const api = "/login";
export default {
    login(payload) { return Repository.post(`${api}`, payload); },
    refresh_token(payload) { return Repository.post(`${api + "/refresh-token"}`, payload); },
}