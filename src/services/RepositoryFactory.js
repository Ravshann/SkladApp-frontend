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
import UsersRepository from "./UsersRepository"
import RolesRepository from "./RolesRepository"
import DepartmentsRepository from "./DepartmentsRepository"
import DepartmentManagersRepository from "./DeparmentManagersRepository"
import StorageManagersRepository from "./StorageManagersRepository"
import LoginControl from "./LoginControl"
import ExchangeRepository from "./ExchangesRepository"
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
    companies: CompaniesRepository,
    users: UsersRepository,
    roles: RolesRepository,
    departments: DepartmentsRepository,
    department_managers: DepartmentManagersRepository,
    storage_managers: StorageManagersRepository,
    login_control: LoginControl,
    exchanges: ExchangeRepository,
};

export default {
    get: name => repositories[name]
};