import Repository from "./Repository";
const api = "/exchange";
export default {
    save(payload) { Repository.post(`${api + "/save"}`, payload); },
    get() { return Repository.get(`${api}`); },
    update(payload) { Repository.post(`${api + "/update"}`, payload); },
    get_by_storage(storage_id) { return Repository.get(`${api + "/" + storage_id}`); },
    get_by_supplier_storage(storage_id) { return Repository.get(`${api + "/supplier/" + storage_id}`); },
    get_by_department_storages(payload) {
        return Repository.post(`${api + "/department-records/"}`, payload);
    },
}