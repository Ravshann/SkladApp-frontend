import Repository from "./Repository";
const api = "/defected";
export default {
    save(payload) { Repository.post(`${api + "/save"}`, payload); },
    get() { return Repository.get(`${api}`); },
    update(payload) { Repository.post(`${api + "/update"}`, payload); },
    get_by_storage(storage_id) { return Repository.get(`${api + "/" + storage_id}`); },
}