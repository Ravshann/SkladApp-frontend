import Repository from "./Repository";
const api = "/remainder";
export default {
    get: function(){
        return Repository.get(`${api}`);
    },
}