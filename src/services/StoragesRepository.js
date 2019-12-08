import Repository from "./Repository";
const api = "/storages";
export default {
    get() { return Repository.get(`${api}`); },
    get_defected_storage() { return Repository.get(`${api + "/defected"}`); },
    get_single(user_id) { return Repository.get(`${api + "/" + user_id}`); },
    get_regional_storages(regional_manager_ID) { return Repository.get(`${api + "/regional/" + regional_manager_ID}`); },
    save(payload) { Repository.post(`${api + "/"}`, payload); },
    update(id, payload) { Repository.post(`${api + "/" + id}`, payload); },
}