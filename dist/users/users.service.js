"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const user_schema_1 = require("./schemas/user.schema");
const email_service_1 = require("../email/email.service");
let UsersService = UsersService_1 = class UsersService {
    userModel;
    emailService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userModel, emailService) {
        this.userModel = userModel;
        this.emailService = emailService;
    }
    create(dto) {
        return (0, rxjs_1.from)(this.userModel.create(dto)).pipe((0, operators_1.switchMap)((user) => this.emailService.sendNotification(user).pipe((0, operators_1.map)(() => user))), (0, operators_1.switchMap)((user) => this.emailService.sendNotificationConfirmation(user)), (0, operators_1.map)(() => {
            this.logger.log(`Usuario creado y email enviado`);
            return {
                code: 200,
                message: 'Usuario creado correctamente',
            };
        }), (0, operators_1.catchError)((err) => {
            this.logger.error('Error enviando email', err);
            return (0, rxjs_1.of)({
                code: 200,
                message: 'Usuario creado correctamente (email no enviado)',
            });
        }), (0, operators_1.catchError)((error) => {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error('Error al crear el usuario: ' + errorMessage);
        }));
    }
    findAll() {
        return (0, rxjs_1.from)(this.userModel.find().exec());
    }
    findOne(id) {
        return (0, rxjs_1.from)(this.userModel.findById(id).exec());
    }
    update(id, dto) {
        return (0, rxjs_1.from)(this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec()).pipe((0, operators_1.catchError)((error) => {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error('Error al actualizar el usuario: ' + errorMessage);
        }));
    }
    remove(id) {
        return (0, rxjs_1.from)(this.userModel.findByIdAndDelete(id).exec());
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map