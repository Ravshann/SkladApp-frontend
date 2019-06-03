import Repository from "./Repository";
const api = "/clients";
export default {
    get: function () {
        return Repository.get(`${api}`);
    },
}