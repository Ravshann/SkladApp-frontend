import Repository from "./Repository";
const api = "/remainder";
export default {
    get() { return Repository.get(`${api}`); },
    get_by_storage(storage_id) {
        return Repository.get(`${api + "/storage/" + storage_id}`);
    },
}