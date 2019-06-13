import RemainderRepository from "./RemainderRepository";
import ClientsRepository from "./ClientsRepository";
import ProductsRepository from "./ProductsRepository";
import StoragesRepository from "./StoragesRepository";
import OutgoingRepository from "./OutgoingRepository";
import IncomingRepository from "./IncomingRepository";
import SuppliersRepository from "./SuppliersRepository";
import ReturnedRepository from "./ReturnedRepository";
import DefectedRepository from "./DefectedRepository";

const repositories = {
    remainder: RemainderRepository,
    clients: ClientsRepository,
    suppliers: SuppliersRepository,
    storages: StoragesRepository,
    products: ProductsRepository,
    outgoing: OutgoingRepository,
    incoming: IncomingRepository,
    returned: ReturnedRepository,
    defected: DefectedRepository
};

export default {
    get: name => repositories[name]
};