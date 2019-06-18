import Repository from "./Repository";
const api = "/returned";
export default {
    update(payload) { Repository.post(`${api + "/update"}`, payload); },
    save(payload) { Repository.post(`${api + "/save"}`, payload); },
    get() { return Repository.get(`${api}`); },
}