import Repository from "./Repository";
const api = "/companies";
export default {
    get() { return Repository.get(`${api}`); },
    save(payload) { Repository.post(`${api}`, payload); },
    update(id, payload) { Repository.post(`${api + "/" + id}`, payload); },
}