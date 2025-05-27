import { JwtService } from '@nestjs/jwt';
import { USER_ROLES } from '../../auth/application/enum/user-roles.enum';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../../auth/domain/interfaces/user-repository.interface';
import { UserEntity } from '../../auth/infrastructure/database/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from '../../../../test/test-app.module';
import { SubjectController } from '../application/controller/subject.controller';
import { SUBJECT_SERVICE_KEY } from '../domain/interfaces/subject-service.interface';
import { v4 as uuidv4 } from 'uuid';
import * as request from 'supertest';
import { SubjectResponseDto } from '../application/dto/subject-response.dto';
import { SubjectAlreadyExistsException } from '../domain/exceptions/subject-already-exists.exception';

const mockSubjectService = {
  getAll: jest.fn(),
  create: jest.fn(),
};

describe('Student Module', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: IUserRepository;
  let testUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      controllers: [SubjectController],
      providers: [
        {
          provide: SUBJECT_SERVICE_KEY,
          useValue: mockSubjectService,
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

  describe('GET - /subject', () => {
    it('should get all subjects', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const subjectsResponse: SubjectResponseDto[] = [
        {
          id: 'uuid',
          name: 'Computer Science',
          career: {
            id: 'uuid',
            name: 'Computer Science',
          },
        },
        {
          id: 'uuid-2',
          name: 'Math',
          career: {
            id: 'uuid-2',
            name: 'Math Science',
          },
        },
        {
          id: 'uuid-3',
          name: 'Physics 2',
          career: {
            id: 'uuid-3',
            name: 'Physics',
          },
        },
      ];

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockSubjectService, 'getAll')
        .mockResolvedValueOnce(subjectsResponse);

      await request(app.getHttpServer())
        .get('/subject')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              career: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/subject')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('POST - /subject', () => {
    it('should create a subject', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createSubjectDto = {
        name: 'Computer Science',
        careerId: 'uuid',
      };

      const subjectResponse: SubjectResponseDto = {
        id: 'uuid',
        name: 'Computer Science',
        career: {
          id: 'uuid',
          name: 'Computer Science',
        },
      };

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockSubjectService, 'create')
        .mockResolvedValueOnce(subjectResponse);

      await request(app.getHttpServer())
        .post('/subject')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSubjectDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            career: expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/subject')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw an exception if subject already exists', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createSubjectDto = {
        name: 'Computer Science',
        careerId: 'uuid',
      };

      jest
        .spyOn(mockSubjectService, 'create')
        .mockRejectedValueOnce(
          new SubjectAlreadyExistsException(createSubjectDto.name),
        );

      const authToken = jwtService.sign(testUserPayload);

      await request(app.getHttpServer())
        .post('/subject')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSubjectDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(
            `Subject ${createSubjectDto.name} already exists`,
          );
        });
    });
  });
});
