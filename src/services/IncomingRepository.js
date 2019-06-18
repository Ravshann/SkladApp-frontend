import Repository from "./Repository";
const api = "/incoming";
export default {
    save(payload) { Repository.post(`${api + "/save"}`, payload); },
    get() { return Repository.get(`${api}`); },
    update(payload) { Repository.post(`${api + "/update"}`, payload); }
}