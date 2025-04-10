import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import * as uuid from "uuid";
import { UserInfo } from "./user-info";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { ulid } from "ulid";
import { AuthService } from "src/auth/auth.service";
import { getSha512Hash } from "src/crypto/crypto.util";

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService,
    private authService: AuthService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private dataSource: DataSource
  ) {}

  async createUser(name: string, email: string, password: string) {
    // connection pool test
    // await Promise.all(
    //   Array.from({ length: 30 }).map(() =>
    //     this.userRepository.findOne({ where: { email: email } })
    //   )
    // );
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken }
    });

    if (!user) {
      throw new NotFoundException('User is not exists');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email
    })
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email, password: getSha512Hash(password) }
    });

    if (!user) {
      throw new NotFoundException('User is not exists');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email
    })
  }

  async getUser(id: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User is not exists');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: email }
    })
    return user !== null;
  }

  //transaction (1)
  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;

      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch(e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;

    user.signupVerifyToken = signupVerifyToken;

    await this.userRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

}