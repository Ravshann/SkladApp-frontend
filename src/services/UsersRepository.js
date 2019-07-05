import Repository from "./Repository";
const api = "/users";
export default {
    get() { return Repository.get(`${api}`); },
    save(payload) { Repository.post(`${api}`, payload); },
    update(id, payload) { Repository.post(`${api + "/" + id}`, payload); },
}