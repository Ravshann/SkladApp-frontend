import Repository from "./Repository";
const api = "/outgoing";
export default {
    save: function (payload) { Repository.post(`${api+"/save"}`, payload); },
    get: function(){
        return Repository.get(`${api}`);
    },
}