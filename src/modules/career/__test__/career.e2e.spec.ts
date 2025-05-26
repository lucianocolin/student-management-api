import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from '../../../../test/test-app.module';
import { CareerController } from '../controller/career.controller';
import { CAREER_SERVICE_KEY } from '../domain/interfaces/career-service.interface';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { CareerResponseDto } from '../application/dto/career-response.dto';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../../auth/domain/interfaces/user-repository.interface';
import { UserEntity } from '../../auth/infrastructure/database/user.entity';
import { USER_ROLES } from '../../auth/application/enum/user-roles.enum';
import { CareerNotFoundException } from '../domain/exceptions/career-not-found.exception';
import { CreateCareerDto } from '../application/dto/create-career.dto';
import { CareerAlreadyExistsException } from '../domain/exceptions/career-already-exists.exception';

const mockCareerService = {
  getAll: jest.fn(),
  getOneById: jest.fn(),
  create: jest.fn(),
};

describe('Career Module', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: IUserRepository;
  let testUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      controllers: [CareerController],
      providers: [
        {
          provide: CAREER_SERVICE_KEY,
          useValue: mockCareerService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    jwtService = module.get(JwtService);
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

  describe('GET - /career', () => {
    it('should get all careers', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const careersResponse: CareerResponseDto[] = [
        {
          id: 'uuid',
          name: 'Computer Science',
        },
        {
          id: 'uuid-2',
          name: 'Math Science',
        },
        {
          id: 'uuid-3',
          name: 'Physics',
        },
      ];

      jest
        .spyOn(mockCareerService, 'getAll')
        .mockResolvedValueOnce(careersResponse);

      const authToken = jwtService.sign(testUserPayload);

      await request(app.getHttpServer())
        .get('/career')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/career')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('GET - /career/:id', () => {
    it('should get a career by id', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const careerResponse: CareerResponseDto = {
        id: 'uuid',
        name: 'Computer Science',
      };

      jest
        .spyOn(mockCareerService, 'getOneById')
        .mockResolvedValueOnce(careerResponse);

      const authToken = jwtService.sign(testUserPayload);

      await request(app.getHttpServer())
        .get('/career/uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/career/uuid')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw an exception if career does not exist', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockCareerService, 'getOneById')
        .mockRejectedValueOnce(new CareerNotFoundException('uuid'));

      await request(app.getHttpServer())
        .get('/career/uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toEqual(`Career with id uuid not found`);
        });
    });
  });

  describe('POST - /career', () => {
    it('should create a career', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createCareerDto: CreateCareerDto = {
        name: 'Computer Science',
      };

      const careerResponse: CareerResponseDto = {
        id: 'uuid',
        name: 'Computer Science',
      };

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockCareerService, 'create')
        .mockResolvedValueOnce(careerResponse);

      await request(app.getHttpServer())
        .post('/career')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCareerDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/career')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw an exception if career already exists', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createCareerDto: CreateCareerDto = {
        name: 'Computer Science',
      };

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockCareerService, 'create')
        .mockRejectedValueOnce(new CareerAlreadyExistsException('name'));

      await request(app.getHttpServer())
        .post('/career')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCareerDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(`Career with name name already exists`);
        });
    });
  });
});
