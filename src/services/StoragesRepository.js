import Repository from "./Repository";
const api = "/storages";
export default {
    get: function () { return Repository.get(`${api}`); }
}