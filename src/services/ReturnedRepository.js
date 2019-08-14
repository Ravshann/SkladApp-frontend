import Repository from "./Repository";
const api = "/returned";

export default {
    update(payload) { Repository.post(`${api + "/update"}`, payload); },
    save(payload) { Repository.post(`${api + "/save"}`, payload); },
    get() { return Repository.get(`${api}`); },
    get_by_storage(storage_id) { return Repository.get(`${api + "/" + storage_id}`); },
}