import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'controller@gmail.com',
          password: 'controllerPassword',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'controllerPassword' } as User,
        ]);
      },
      update: (id: number) => {
        return Promise.resolve({
          id,
          email: 'controller@gmail.com',
          password: 'controllerPassword',
        } as User);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'controller@gmail.com',
          password: 'controllerPassword',
        } as User);
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser should find the user with id', async () => {
    //await fakeAuthService.signup('controller@test.com', 'testtest');
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('controller@gmail.com');
    expect(user.password).toBe('controllerPassword');
  });

  it('findUser throws error if user with given id not found', async () => {
    //await fakeAuthService.signup('controller@test.com', 'testtest');
    fakeUsersService.findOne = () => null;
    expect(controller.findUser('1')).rejects.toThrowError(NotFoundException);
  });

  it('findAllUsers returns a list with the given email', async () => {
    // await fakeAuthService.signup('controller@test.com', 'testtest');
    const users = await controller.findAllUsers('controller@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('controller@test.com');
  });

  it('findAllUsers returns a list of blank if no email is found', async () => {
    fakeUsersService.find = () => Promise.resolve([]);
    const users = await controller.findAllUsers('controller@test.com');
    expect(users.length).toEqual(0);
  });

  it('signInUser updates session object and returns a user', async () => {
    const session = {userId: -10};
    const user = await controller.signinUser(
      { email: 'testSignIn@gmail.com', password: 'testsignin' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(user.email).toEqual('testSignIn@gmail.com');
    expect(user.password).toEqual('testsignin');
    expect(user).toBeDefined();
    expect(session.userId).toEqual(1)
  });

});
