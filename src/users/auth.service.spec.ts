import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('abced@gmail.com', 'abcde12345');
    expect(user.password).not.toEqual('abcde12345');
    expect(user.password).toContain('.');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user sign up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'asdf', password: '1' } as User]);

    // Previous version usable, now not allowed
    // Test functions cannot both take a 'done' callback and return something. Either use a 'done' callback,
    // or return a promise. Returned value: Promise {}
    //
    /*
    try {
      await service.signup('asdf@asdf.com', 'asdf')
    } catch (error) {
      done();
    }
    */

    await expect(
      service.signup('asdf@asdf.com', 'asdf'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws an error if sign-in called with unknown email', async () => {
    await expect(
      service.signin('asdf@asdf.com', 'asdf'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws an error when user sign-in with invalid password', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test@test.com', password: 'correctPassword' } as User,
      ]);
    await expect(
      service.signin('asdf@asdf.com', 'wrongPassword'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns user when user sign-in with correct credentials(password)', async () => {
    // More of a unrefined way of test
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'test@test.com',
    //       password:
    //         '0bf52d076031c350.f64747d8952e7c3c842c48a4124725144c2963510bfbf8c1b25ddd2a342569c6',
    //     } as User,
    //   ]);

    await service.signup('test@test.com', 'correctPassword');
    expect(service.signin('test@test.com', 'correctPassword1')).toBeDefined();
  });
});
