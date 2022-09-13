import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User)
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User)
      },
    };
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'controller@gmail.com', password: 'controllerPassword'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'controllerPassword'} as User])
      },
      update: (id: number) => {
        return Promise.resolve({id, email: 'controller@gmail.com', password: 'controllerPassword'} as User)
      },
      remove: (id: number) => {
        return Promise.resolve({id, email: 'controller@gmail.com', password: 'controllerPassword'} as User)
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be able to find a user', () => {
    expect(controller).toBeDefined();
  });
});
