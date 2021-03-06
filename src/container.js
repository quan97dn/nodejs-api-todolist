const { createContainer, asClass, asFunction, asValue } = require("awilix");
const { scopePerRequest } = require("awilix-express");

const config = require("../config");
const Application = require("./app/Application");

/**
 * Operation
 */

const {
  CreateUser,
  GetAllUsers,
  GetUser,
  UpdateUser,
  DeleteUser
} = require("./app/user");

const { PostToken, Register } = require("./app/token");

const {
  CreateCategory,
  GetAllCategories,
  GetCategory,
  UpdateCategory,
  DeleteCategory,
  OrderCategory
} = require("./app/category");

const {
  CreateDirectory,
  GetAllDirectories,
  GetDirectory,
  UpdateDirectory,
  DeleteDirectory
} = require("./app/directory");

const {
  CreateMedia,
  GetAllMedia,
  GetMedia,
  UpdateMedia,
  DeleteMedia
} = require("./app/media");

const {
  CreateTask,
  GetAllTasks,
  GetTask,
  UpdateTask,
  DeleteTask,
  OrderTask
} = require("./app/task");

const Server = require("./interfaces/http/Server");
const router = require("./interfaces/http/router");
const auth = require("./interfaces/http/auth");

const loggerMiddleware = require("./interfaces/http/logging/loggerMiddleware");
const errorHandler = require("./interfaces/http/errors/errorHandler");
const devErrorHandler = require("./interfaces/http/errors/devErrorHandler");
const swaggerMiddleware = require("./interfaces/http/swagger/swaggerMiddleware");

const encryption = require("./infra/encryption");
const logger = require("./infra/logging/logger");

/**
 * Serialize
 */

const UserSerializer = require("./interfaces/http/modules/user/UserSerializer");
const CategorySerializer = require("./interfaces/http/modules/category/CategorySerializer");
const DirectorySerializer = require("./interfaces/http/modules/directory/DirectorySerializer");
const MediaSerializer = require("./interfaces/http/modules/media/MediaSerializer");
const TaskSerializer = require("./interfaces/http/modules/task/TaskSerializer");

/**
 * Repository
 */
const SequelizeUsersRepository = require("./infra/repositories/user/SequelizeUsersRepository");
const SequelizeCategoriesRepository = require("./infra/repositories/category/SequelizeCategoriesRepository");
const SequelizeDirectoriesRepository = require("./infra/repositories/directory/SequelizeDirectoriesRepository");
const jwt = require("./infra/repositories/jwt");
const SequelizeMediaRepository = require("./infra/repositories/media/SequelizeMediaRepository");
const SequelizeTasksRepository = require("./infra/repositories/task/SequelizeTasksRepository");

/**
 * Model
 */

const {
  database,
  user: UserModel,
  role: RoleModel,
  permission: PermissionModel,
  userrole: UserRoleModel,
  category: CategoryModel,
  product: ProductModel,
  directory: DirectoryModel,
  media: MediaModel,
  task: TaskModel
} = require("./infra/database/models");

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    auth: asFunction(auth).singleton(),
    jwt: asFunction(jwt).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config),
    encryption: asValue(encryption)
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware])
  });

// Repositories
container.register({
  usersRepository: asClass(SequelizeUsersRepository).singleton(),
  categoriesRepository: asClass(SequelizeCategoriesRepository).singleton(),
  directoriesRepository: asClass(SequelizeDirectoriesRepository).singleton(),
  mediaRepository: asClass(SequelizeMediaRepository).singleton(),
  tasksRepository: asClass(SequelizeTasksRepository).singleton()
});

// Database
container.register({
  database: asValue(database),
  UserModel: asValue(UserModel),
  RoleModel: asValue(RoleModel),
  PermissionModel: asValue(PermissionModel),
  UserRoleModel: asValue(UserRoleModel),
  CategoryModel: asValue(CategoryModel),
  ProductModel: asValue(ProductModel),
  DirectoryModel: asValue(DirectoryModel),
  MediaModel: asValue(MediaModel),
  TaskModel: asValue(TaskModel)
});

// Operations
container.register({
  // user
  createUser: asClass(CreateUser),
  getAllUsers: asClass(GetAllUsers),
  getUser: asClass(GetUser),
  updateUser: asClass(UpdateUser),
  deleteUser: asClass(DeleteUser),
  // token
  postToken: asClass(PostToken),
  register: asClass(Register),
  // category
  createCategory: asClass(CreateCategory),
  getAllCategories: asClass(GetAllCategories),
  getCategory: asClass(GetCategory),
  updateCategory: asClass(UpdateCategory),
  deleteCategory: asClass(DeleteCategory),
  orderCategory: asClass(OrderCategory),
  // directory
  createDirectory: asClass(CreateDirectory),
  getAllDirectories: asClass(GetAllDirectories),
  getDirectory: asClass(GetDirectory),
  updateDirectory: asClass(UpdateDirectory),
  deleteDirectory: asClass(DeleteDirectory),
  // media
  createMedia: asClass(CreateMedia),
  getAllMedia: asClass(GetAllMedia),
  getMedia: asClass(GetMedia),
  updateMedia: asClass(UpdateMedia),
  deleteMedia: asClass(DeleteMedia),
  // task
  createTask: asClass(CreateTask),
  getAllTasks: asClass(GetAllTasks),
  getTask: asClass(GetTask),
  updateTask: asClass(UpdateTask),
  deleteTask: asClass(DeleteTask),
  orderTask: asClass(OrderTask),
});

// Serializers
container.register({
  userSerializer: asValue(UserSerializer),
  categorySerializer: asValue(CategorySerializer),
  directorySerializer: asValue(DirectorySerializer),
  mediaSerializer: asValue(MediaSerializer),
  taskSerializer: asValue(TaskSerializer)
});

module.exports = container;
