import Repository from "./Repository";
const api = "/product_attribute";
export default {
    get() { return Repository.get(`${api}`); },
    save(payload) { Repository.post(`${api + "/save"}`, payload); },
    update(payload) { Repository.post(`${api + "/update"}`, payload); },
    delete(payload) { Repository.post(`${api + "/delete"}`, payload); },
}