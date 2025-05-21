import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../application/service/auth.service';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { USER_ROLES } from '../application/enum/user-roles.enum';
import * as request from 'supertest';
import { TestAppModule } from '../../../../test/test-app.module';
import { UserAlreadyExistsException } from '../domain/exceptions/user-already-exists.exception';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { UserNotFoundException } from '../domain/exceptions/user-not-found.exception';
import { InvalidPasswordException } from '../domain/exceptions/invalid-password.exception';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('Auth Module', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    app = module.createNestApplication();

    authService = module.get<AuthService>(AuthService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST - /auth/register', () => {
    it('should register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        fullName: 'John Doe',
        email: 'bBZQm@example.com',
        password: 'Pass123?',
        phoneNumber: '1234567890',
      };

      jest.spyOn(authService, 'register').mockResolvedValueOnce({
        id: '1',
        fullName: 'John Doe',
        email: 'bBZQm@example.com',
        phoneNumber: '+1234567890',
        roles: [USER_ROLES.USER],
      } as any);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerUserDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            fullName: expect.any(String),
            email: expect.any(String),
            phoneNumber: expect.any(String),
            roles: expect.arrayContaining([USER_ROLES.USER]),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        fullName: 'John Doe',
        email: 'bBZQm@example.com',
        password: 'Pass123?',
        phoneNumber: '1234567890',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValueOnce(
          new UserAlreadyExistsException(registerUserDto.email),
        );

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(
            `User with email ${registerUserDto.email} already exists`,
          );
        });
    });
  });

  describe('POST - /auth/login', () => {
    it('should login a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'bBZQm@example.com',
        password: 'Pass123?',
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce({
        id: '1',
        fullName: 'John Doe',
        email: 'bBZQm@example.com',
        phoneNumber: '+1234567890',
        roles: [USER_ROLES.USER],
        token: 'token',
      } as any);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            fullName: expect.any(String),
            email: expect.any(String),
            phoneNumber: expect.any(String),
            roles: expect.arrayContaining([USER_ROLES.USER]),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user does not exist', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'bBZQE@example.com',
        password: 'Pass123?',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new UserNotFoundException(loginUserDto.email));

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(
            `User with email ${loginUserDto.email} not found`,
          );
        });
    });

    it('should throw an exception if password is incorrect', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'bBZQm@example.com',
        password: 'Pass123???',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new InvalidPasswordException());

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual('Invalid password');
        });
    });
  });
});
