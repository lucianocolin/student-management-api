import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IUserRepository,
  USER_REPOSITORY_KEY,
} from '../../auth/domain/interfaces/user-repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { TestAppModule } from '../../../../test/test-app.module';
import { EnrollmentController } from '../controller/enrollment.controller';
import { ENROLLMENT_SERVICE_KEY } from '../domain/interface/enrollment-service.interface';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../auth/infrastructure/database/user.entity';
import { USER_ROLES } from '../../auth/application/enum/user-roles.enum';
import { EnrollmentResponseDto } from '../application/dto/enrollment-response.dto';
import * as request from 'supertest';
import { CreateEnrollmentDto } from '../application/dto/create-enrollment.dto';

const mockEnrollmentService = {
  getAll: jest.fn(),
  create: jest.fn(),
};

describe('Enrollment Module', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: IUserRepository;
  let testUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
      controllers: [EnrollmentController],
      providers: [
        {
          provide: ENROLLMENT_SERVICE_KEY,
          useValue: mockEnrollmentService,
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

  describe('GET - /enrollment', () => {
    it('should get all enrollments', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const enrollmentsResponse: EnrollmentResponseDto[] = [
        {
          id: 'uuid',
          studentId: 'studentId',
          subjectId: 'subjectId',
          grade: 10,
          enrolledAt: new Date(),
          approved: true,
        },
        {
          id: 'uuid-2',
          studentId: 'studentId-2',
          subjectId: 'subjectId-2',
          grade: 10,
          enrolledAt: new Date(),
          approved: true,
        },
      ];

      jest
        .spyOn(mockEnrollmentService, 'getAll')
        .mockResolvedValueOnce(enrollmentsResponse);

      const authToken = jwtService.sign(testUserPayload);

      await request(app.getHttpServer())
        .get('/enrollment')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              studentId: expect.any(String),
              subjectId: expect.any(String),
              grade: expect.any(Number),
              enrolledAt: expect.any(String),
              approved: expect.any(Boolean),
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should filter enrollments by studentId', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };
      const enrollmentsResponse: EnrollmentResponseDto[] = [
        {
          id: 'uuid',
          studentId: 'studentId',
          subjectId: 'subjectId',
          grade: 10,
          enrolledAt: new Date(),
          approved: true,
          student: {
            id: 'studentId',
            fullName: 'John Doe',
            email: 'admin@example.com',
            collegeId: 100,
            career: {
              id: 'careerId',
              name: 'Computer Science',
            },
            subjects: [
              {
                id: 'subjectId',
                name: 'Computer Science',
                career: {
                  id: 'careerId',
                  name: 'Computer Science',
                },
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          subject: {
            id: 'subjectId',
            name: 'Computer Science',
            career: {
              id: 'careerId',
              name: 'Computer Science',
            },
          },
        },
      ];

      jest
        .spyOn(mockEnrollmentService, 'getAll')
        .mockResolvedValueOnce(enrollmentsResponse);

      const authToken = jwtService.sign(testUserPayload);

      await request(app.getHttpServer())
        .get('/enrollment?studentId=studentId')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              studentId: expect.any(String),
              subjectId: expect.any(String),
              grade: expect.any(Number),
              enrolledAt: expect.any(String),
              approved: expect.any(Boolean),
            }),
          ]);

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an error if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/enrollment')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('POST - /enrollment', () => {
    it('should create an enrollment', async () => {
      const testUserPayload = {
        id: testUserId,
        email: 'admin@example.com',
      };

      const createEnrollmentDto: CreateEnrollmentDto = {
        subjectId: 'subjectId',
      };

      const enrollmentResponse: EnrollmentResponseDto = {
        id: 'uuid',
        studentId: 'studentId',
        subjectId: 'subjectId',
        grade: null,
        enrolledAt: new Date(),
        approved: true,
      };

      jest
        .spyOn(mockEnrollmentService, 'create')
        .mockResolvedValueOnce(enrollmentResponse);

      const authToken = jwtService.sign(testUserPayload);

      await request(app.getHttpServer())
        .post('/enrollment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createEnrollmentDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(String),
            studentId: expect.any(String),
            subjectId: expect.any(String),
            grade: null,
            enrolledAt: expect.any(String),
            approved: expect.any(Boolean),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an error if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/enrollment')
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });
});
