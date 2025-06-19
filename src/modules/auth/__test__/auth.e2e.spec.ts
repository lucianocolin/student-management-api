import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { USER_ROLES } from '../application/enum/user-roles.enum';
import * as request from 'supertest';
import { TestAppModule } from '../../../../test/test-app.module';
import { UserAlreadyExistsException } from '../domain/exceptions/user-already-exists.exception';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { UserNotFoundException } from '../domain/exceptions/user-not-found.exception';
import { InvalidPasswordException } from '../domain/exceptions/invalid-password.exception';
import { UserNotApprovedException } from '../domain/exceptions/user-not-approved.exception';
import { JwtService } from '@nestjs/jwt';
import { AUTH_SERVICE_KEY } from '../domain/interfaces/auth-service.interface';
import { AuthController } from '../controller/auth.controller';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../domain/interfaces/user-repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../infrastructure/database/user.entity';
import { UserMapper } from '../application/mapper/user.mapper';
import { UserIdNotFoundException } from '../domain/exceptions/user-id-not-found.exception';

const mockAuthService = {
  getNotApprovedUsers: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  approveRegistrationRequest: jest.fn(),
};

describe('Auth Module', () => {
  let app: INestApplication;
  let testUserId: string;
  let jwtService: JwtService;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AUTH_SERVICE_KEY,
          useValue: mockAuthService,
        },
        UserMapper,
      ],
    }).compile();

    app = module.createNestApplication();
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY_KEY);

    testUserId = uuidv4();

    const testUser = new UserEntity();
    testUser.id = testUserId;
    testUser.email = 'admin@example.com';
    testUser.fullName = 'John Doe';
    testUser.password = 'hashedPassword';
    testUser.phoneNumber = '1234567890';
    testUser.roles = [USER_ROLES.ADMIN];
    await userRepository.saveOne(testUser);

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

      jest.spyOn(mockAuthService, 'register').mockResolvedValueOnce({
        id: '1',
        fullName: 'John Doe',
        email: 'bBZQm@example.com',
        phoneNumber: '+1234567890',
        roles: [USER_ROLES.USER],
        isApproved: false,
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
        .spyOn(mockAuthService, 'register')
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

  describe('GET - /auth/not-approved-users', () => {
    it('should get all not approved users', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const authToken = jwtService.sign(testUserPayload);

      jest.spyOn(mockAuthService, 'getNotApprovedUsers').mockResolvedValueOnce([
        {
          id: '1',
          fullName: 'John Doe',
          email: 'bBZQm@example.com',
          phoneNumber: '+1234567890',
          roles: [USER_ROLES.USER],
          isApproved: false,
        } as any,
      ]);

      await request(app.getHttpServer())
        .get('/auth/not-approved-users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              fullName: expect.any(String),
              email: expect.any(String),
              phoneNumber: expect.any(String),
              roles: expect.arrayContaining([USER_ROLES.USER]),
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not admin', async () => {
      await request(app.getHttpServer())
        .get('/auth/not-approved-users')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('PATCH - /auth/approve/:id', () => {
    it('should approve a user', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const authToken = jwtService.sign(testUserPayload);

      const userId = '1';

      jest
        .spyOn(mockAuthService, 'approveRegistrationRequest')
        .mockResolvedValueOnce({
          id: '1',
          fullName: 'John Doe',
          email: 'bBZQm@example.com',
          phoneNumber: '+1234567890',
          roles: [USER_ROLES.USER],
          isApproved: true,
        } as any);

      await request(app.getHttpServer())
        .patch(`/auth/approve/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
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
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const authToken = jwtService.sign(testUserPayload);

      const userId = '1';

      jest
        .spyOn(mockAuthService, 'approveRegistrationRequest')
        .mockRejectedValueOnce(new UserIdNotFoundException(userId));

      await request(app.getHttpServer())
        .patch(`/auth/approve/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toEqual(`User with id ${userId} not found`);
        });
    });
  });

  describe('POST - /auth/login', () => {
    it('should login a user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'bBZQm@example.com',
        password: 'Pass123?',
      };

      jest.spyOn(mockAuthService, 'login').mockResolvedValueOnce({
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
        .spyOn(mockAuthService, 'login')
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
        .spyOn(mockAuthService, 'login')
        .mockRejectedValueOnce(new InvalidPasswordException());

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual('Invalid password');
        });
    });

    it('should throw an exception if user is not approved', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'bBZQm@example.com',
        password: 'Pass123?',
      };

      jest
        .spyOn(mockAuthService, 'login')
        .mockRejectedValueOnce(
          new UserNotApprovedException(loginUserDto.email),
        );

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(
            `User with email ${loginUserDto.email} hasn't been approved. Contact with an admin`,
          );
        });
    });
  });
});
