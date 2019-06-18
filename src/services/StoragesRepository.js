import Repository from "./Repository";
const api = "/storages";
export default {
    get() { return Repository.get(`${api}`); }
}