import Repository from "./Repository";
const api = "/remainder";
export default {
    get() { return Repository.get(`${api}`); },
    get_defected_remainders() { return Repository.get(`${api + "/defected-goods"}`); },
    get_by_storage(storage_id) {
        return Repository.get(`${api + "/storage/" + storage_id}`);
    },
    get_by_department_storages(payload) {
        return Repository.post(`${api + "/department-storages/"}`, payload);
    },
}