/**
 * this file will hold all the get use-case for user domain
 */
const Token = require("src/domain/token");

const Operation = require("src/app/Operation");

class PostToken extends Operation {
  constructor({ usersRepository, jwt }) {
    super();
    this.usersRepository = usersRepository;
    this.jwt = jwt;
  }

  async execute(body) {
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR,
      EMAIL_NOT_EXIST,
      WRONG_PASSWORD
    } = this.outputs;
    try {
      const credentials = Token(body);
      const userCredentials = await this.usersRepository.findUserWithRolePermission(
        {
          attributes: [
            "id",
            "firstName",
            "lastName",
            "middleName",
            "email",
            "password",
            "isDeleted",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy"
          ],
          where: {
            email: credentials.email,
            isDeleted: 0
          }
        }
      );
      if (!userCredentials) {
        return this.emit(EMAIL_NOT_EXIST);
      } else {
        const validatePass = this.usersRepository.validatePassword(
          userCredentials.password
        );

        if (!validatePass(credentials.password)) {
          return this.emit(WRONG_PASSWORD);
        }
        const signIn = this.jwt.signin();
        const roles = this.toRoleEntity(userCredentials.roles);
        const data = {
          token: signIn({
            id: userCredentials.id,
            firstName: userCredentials.firstName,
            lastName: userCredentials.lastName,
            middleName: userCredentials.middleName,
            email: userCredentials.email,
            isDeleted: userCredentials.isDeleted,
            roles
          })
        };
        this.emit(SUCCESS, {
          token: data,
          user: {
            id: userCredentials.id,
            firstName: userCredentials.firstName,
            lastName: userCredentials.lastName,
            middleName: userCredentials.middleName,
            email: userCredentials.email,
            isDeleted: userCredentials.isDeleted,
            roles
          }
        });
      }
    } catch (error) {
      if (error.message === "ValidationError") {
        return this.emit(VALIDATION_ERROR, error);
      }
      this.emit(ERROR, error);
    }
  }

  toRoleEntity(roleInstances) {
    const result = roleInstances.map(item => {
      const { id, name, permissions } = item.dataValues;
      return { id, name, permissions: this.toPermissionEntity(permissions) };
    });
    return result;
  }

  toPermissionEntity(permissionInstances) {
    const result = permissionInstances.map(item => {
      const { id, name } = item.dataValues;
      return { id, name };
    });
    return result;
  }
}

PostToken.setOutputs([
  "SUCCESS",
  "ERROR",
  "VALIDATION_ERROR",
  "EMAIL_NOT_EXIST",
  "WRONG_PASSWORD"
]);

module.exports = PostToken;
