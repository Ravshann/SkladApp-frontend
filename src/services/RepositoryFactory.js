import RemainderRepository from "./RemainderRepository";
import ClientsRepository from "./ClientsRepository";
import ProductsRepository from "./ProductsRepository";
import StoragesRepository from "./StoragesRepository";
import OutgoingRepository from "./OutgoingRepository";
import IncomingRepository from "./IncomingRepository";
import SuppliersRepository from "./SuppliersRepository";

const repositories = {
    remainder: RemainderRepository,
    clients: ClientsRepository,
    suppliers: SuppliersRepository,
    storages: StoragesRepository,
    products: ProductsRepository,
    outgoing: OutgoingRepository,
    incoming: IncomingRepository,
};

export default {
    get: name => repositories[name]
};