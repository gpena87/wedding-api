import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): import("rxjs").Observable<{
        code: number;
        message: string;
    }>;
    findAll(): import("rxjs").Observable<import("./schemas/user.schema").UserDocument[]>;
    findOne(id: string): import("rxjs").Observable<import("./schemas/user.schema").UserDocument | null>;
    update(id: string, dto: UpdateUserDto): import("rxjs").Observable<import("./schemas/user.schema").UserDocument | null>;
    remove(id: string): import("rxjs").Observable<import("./schemas/user.schema").UserDocument | null>;
}
