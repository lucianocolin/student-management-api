import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { StudentResponseDto } from '../application/dto/student-response.dto';
import { StudentController } from '../controller/student.controller';
import { STUDENT_SERVICE_KEY } from '../domain/interfaces/student-service.interface';
import { TestAppModule } from '../../../../test/test-app.module';
import { JwtService } from '@nestjs/jwt';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../../auth/domain/interfaces/user-repository.interface';
import { UserEntity } from '../../auth/infrastructure/database/user.entity';
import { USER_ROLES } from '../../auth/application/enum/user-roles.enum';
import { v4 as uuidv4 } from 'uuid';
import { StudentNotFoundException } from '../domain/exceptions/student-not-found.exception';
import { CreateStudentDto } from '../application/dto/create-student.dto';
import { UserAlreadyExistsException } from '../../auth/domain/exceptions/user-already-exists.exception';

const mockStudentService = {
  getAll: jest.fn(),
  getOneById: jest.fn(),
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
      controllers: [StudentController],
      providers: [
        {
          provide: STUDENT_SERVICE_KEY,
          useValue: mockStudentService,
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

  describe('GET - /student', () => {
    it('should get all students', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const studentsResponse: StudentResponseDto[] = [
        {
          id: 'uuid',
          fullName: 'John Doe',
          email: 'Q5NtD@example.com',
          career: {
            id: 'id',
            name: 'Computer Science',
          },
          collegeId: 1,
          subjects: ['Mathematics', 'Physics'],
          qualifications: [80, 90],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'uuid-2',
          fullName: 'John Doe 2',
          email: 'Q5NtE@example.com',
          career: {
            id: 'id',
            name: 'Math Science',
          },
          collegeId: 2,
          subjects: ['History', 'Physics'],
          qualifications: [70, 50],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockStudentService, 'getAll')
        .mockResolvedValue(studentsResponse);

      await request(app.getHttpServer())
        .get('/student')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              fullName: expect.any(String),
              email: expect.any(String),
              career: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
              collegeId: expect.any(Number),
              subjects: expect.any(Array),
              qualifications: expect.any(Array),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              deletedAt: null,
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/student')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('GET - /student/:id', () => {
    it('should get a student by id', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const studentResponse: StudentResponseDto = {
        id: 'uuid',
        fullName: 'John Doe',
        email: 'Q5NtD@example.com',
        career: {
          id: 'id',
          name: 'Computer Science',
        },
        collegeId: 1,
        subjects: ['Mathematics', 'Physics'],
        qualifications: [80, 90],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockStudentService, 'getOneById')
        .mockResolvedValue(studentResponse);

      await request(app.getHttpServer())
        .get('/student/uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            fullName: expect.any(String),
            email: expect.any(String),
            career: expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
            collegeId: expect.any(Number),
            subjects: expect.any(Array),
            qualifications: expect.any(Array),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/student/uuid')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw an exception if student does not exist', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockStudentService, 'getOneById')
        .mockRejectedValueOnce(new StudentNotFoundException('uuid'));

      await request(app.getHttpServer())
        .get('/student/uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(`Student with id uuid not found`);
        });
    });
  });

  describe('POST - /student', () => {
    it('should create a new student', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createStudentDto: CreateStudentDto = {
        fullName: 'John Doe',
        email: 'Q5NtD@example.com',
        collegeId: 1,
        careerId: 'id',
        subjects: ['Mathematics', 'Physics'],
      };

      const studentResponse: StudentResponseDto = {
        id: 'uuid',
        fullName: 'John Doe',
        email: 'Q5NtD@example.com',
        career: {
          id: 'id',
          name: 'Computer Science',
        },
        collegeId: 1,
        subjects: ['Mathematics', 'Physics'],
        qualifications: [80, 90],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockStudentService, 'create')
        .mockResolvedValue(studentResponse);

      await request(app.getHttpServer())
        .post('/student')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createStudentDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            fullName: expect.any(String),
            email: expect.any(String),
            career: expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
            collegeId: expect.any(Number),
            subjects: expect.any(Array),
            qualifications: expect.any(Array),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an exception if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/student')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw an exception if student already exists', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createStudentDto: CreateStudentDto = {
        fullName: 'John Doe',
        email: 'Q5NtD@example.com',
        collegeId: 1,
        careerId: 'id',
        subjects: ['Mathematics', 'Physics'],
      };

      const authToken = jwtService.sign(testUserPayload);

      jest
        .spyOn(mockStudentService, 'create')
        .mockRejectedValueOnce(
          new UserAlreadyExistsException(createStudentDto.email),
        );

      await request(app.getHttpServer())
        .post('/student')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createStudentDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(({ body }) => {
          expect(body.message).toEqual(
            `User with email ${createStudentDto.email} already exists`,
          );
        });
    });
  });
});
