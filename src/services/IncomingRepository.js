import Repository from "./Repository";
const api = "/incoming/save";
export default {
    save: function (payload) { Repository.post(`${api}`, payload); }
}