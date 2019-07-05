import Repository from "./Repository";
const api = "/department_managers";
export default {
    get() { return Repository.get(`${api}`); },
}