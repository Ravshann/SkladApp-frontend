import RemainderRepository from "./RemainderRepository";
import ClientsRepository from "./ClientsRepository";
import ProductsRepository from "./ProductsRepository";
import StoragesRepository from "./StoragesRepository";
import OutgoingRepository from "./OutgoingRepository";
import IncomingRepository from "./IncomingRepository";
import SuppliersRepository from "./SuppliersRepository";
import ReturnedRepository from "./ReturnedRepository";
import DefectedRepository from "./DefectedRepository";
import CategoriesRepository from "./CategoriesRepository";
import AttributesRepository from "./AttributesRepository";
import ProductAttributeRepository from "./ProductAttributeRepository";
import CompaniesRepository from "./CompaniesRepository"
const repositories = {
    remainder: RemainderRepository,
    clients: ClientsRepository,
    suppliers: SuppliersRepository,
    storages: StoragesRepository,
    products: ProductsRepository,
    outgoing: OutgoingRepository,
    incoming: IncomingRepository,
    returned: ReturnedRepository,
    defected: DefectedRepository,
    categories: CategoriesRepository,
    attributes: AttributesRepository,
    product_attribute: ProductAttributeRepository,
    companies: CompaniesRepository
};

export default {
    get: name => repositories[name]
};