import Repository from "./Repository";
const api = "/storages";
export default {
    get() { return Repository.get(`${api}`); },
    get_single(user_id) { return Repository.get(`${api + "/" + user_id}`); },
    save(payload) { Repository.post(`${api + "/"}`, payload); },
    update(id, payload) { Repository.post(`${api + "/" + id}`, payload); },
}