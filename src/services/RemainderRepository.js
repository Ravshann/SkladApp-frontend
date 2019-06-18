import Repository from "./Repository";
const api = "/remainder";
export default {
    get() { return Repository.get(`${api}`); },
}