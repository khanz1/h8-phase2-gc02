import { NotFoundError, ConflictError } from "@/shared/errors";
import {
  CareerCompanyRepository,
  CareerJobRepository,
} from "./career.repository";
import {
  CareerCompanyResponse,
  CareerJobResponse,
  PaginatedCareerJobsResponse,
  CreateCareerCompanyDto,
  UpdateCareerCompanyDto,
  CreateCareerJobDto,
  UpdateCareerJobDto,
  CareerQueryDto,
  ICareerCompanyService,
  ICareerJobService,
} from "./career.types";

export class CareerCompanyService implements ICareerCompanyService {
  constructor(private readonly companyRepository: CareerCompanyRepository) {}

  public async getAllCompanies(): Promise<CareerCompanyResponse[]> {
    return await this.companyRepository.findAll();
  }

  public async getCompanyById(id: number): Promise<CareerCompanyResponse> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundError(`Career company with ID ${id} not found`);
    }

    return company;
  }

  public async createCompany(
    data: CreateCareerCompanyDto
  ): Promise<CareerCompanyResponse> {
    try {
      return await this.companyRepository.create(data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(
          `Company with name '${data.name}' or email '${data.email}' already exists`
        );
      }
      throw error;
    }
  }

  public async updateCompany(
    id: number,
    data: UpdateCareerCompanyDto
  ): Promise<CareerCompanyResponse> {
    try {
      const updatedCompany = await this.companyRepository.update(id, data);

      if (!updatedCompany) {
        throw new NotFoundError(`Career company with ID ${id} not found`);
      }

      return updatedCompany;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        throw new ConflictError(
          `Company with name '${data.name}' or email '${data.email}' already exists`
        );
      }
      throw error;
    }
  }

  public async deleteCompany(id: number): Promise<void> {
    try {
      const deleted = await this.companyRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError(`Career company with ID ${id} not found`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        throw new ConflictError(
          "Cannot delete company that has associated job postings"
        );
      }
      throw error;
    }
  }
}

export class CareerJobService implements ICareerJobService {
  constructor(
    private readonly jobRepository: CareerJobRepository,
    private readonly companyRepository: CareerCompanyRepository
  ) {}

  public async getAllJobs(): Promise<CareerJobResponse[]> {
    return await this.jobRepository.findAll();
  }

  public async getAllJobsPublic(
    query: CareerQueryDto
  ): Promise<PaginatedCareerJobsResponse> {
    const { jobs, total } = await this.jobRepository.findAllPublic(query);
    const totalPages = Math.ceil(total / query.limit);

    return {
      data: jobs,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  public async getJobById(id: number): Promise<CareerJobResponse> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundError(`Career job with ID ${id} not found`);
    }

    return job;
  }

  public async getJobByIdPublic(id: number): Promise<CareerJobResponse> {
    const job = await this.jobRepository.findByIdPublic(id);

    if (!job) {
      throw new NotFoundError(`Career job with ID ${id} not found`);
    }

    return job;
  }

  public async createJob(
    data: CreateCareerJobDto,
    authorId: number
  ): Promise<CareerJobResponse> {
    // Verify company exists
    const company = await this.companyRepository.findById(data.companyId);
    if (!company) {
      throw new NotFoundError(
        `Career company with ID ${data.companyId} not found`
      );
    }

    return await this.jobRepository.create(data, authorId);
  }

  public async updateJob(
    id: number,
    data: UpdateCareerJobDto
  ): Promise<CareerJobResponse> {
    // Verify company exists
    const company = await this.companyRepository.findById(data.companyId);
    if (!company) {
      throw new NotFoundError(
        `Career company with ID ${data.companyId} not found`
      );
    }

    const updatedJob = await this.jobRepository.update(id, data);

    if (!updatedJob) {
      throw new NotFoundError(`Career job with ID ${id} not found`);
    }

    return updatedJob;
  }

  public async updateJobImage(
    id: number,
    imgUrl: string
  ): Promise<CareerJobResponse> {
    const updatedJob = await this.jobRepository.updateImage(id, imgUrl);

    if (!updatedJob) {
      throw new NotFoundError(`Career job with ID ${id} not found`);
    }

    return updatedJob;
  }

  public async deleteJob(id: number): Promise<void> {
    const deleted = await this.jobRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Career job with ID ${id} not found`);
    }
  }
}
