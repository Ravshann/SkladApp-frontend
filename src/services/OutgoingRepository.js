import Repository from "./Repository";
const api = "/outgoing/save";
export default {
    save: function (payload) { Repository.post(`${api}`, payload); }
}