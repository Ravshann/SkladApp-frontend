import Repository from "./Repository";
const api = "/suppliers";
export default {
    get: function () {
        return Repository.get(`${api}`);
    },
}