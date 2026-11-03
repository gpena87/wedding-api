import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email/email.service';
export declare class UsersService {
    private userModel;
    private emailService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, emailService: EmailService);
    create(dto: CreateUserDto): Observable<{
        code: number;
        message: string;
    }>;
    findAll(): Observable<UserDocument[]>;
    findOne(id: string): Observable<UserDocument | null>;
    update(id: string, dto: UpdateUserDto): Observable<UserDocument | null>;
    remove(id: string): Observable<UserDocument | null>;
}
