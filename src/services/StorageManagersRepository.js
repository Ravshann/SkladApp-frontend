import Repository from "./Repository";
const api = "/storage_managers";
export default {
    get() { return Repository.get(`${api}`); },
}