import { Op } from "sequelize";
import { CareerCompany, CareerJob } from "./career.model";
import { User } from "@/features/users/user.model";
import { NotFoundError } from "@/shared/errors";
import {
  CareerCompanyResponse,
  CareerJobResponse,
  CreateCareerCompanyDto,
  UpdateCareerCompanyDto,
  CreateCareerJobDto,
  UpdateCareerJobDto,
  CareerQueryDto,
  CareerCompanyRepository as ICareerCompanyRepository,
  CareerJobRepository as ICareerJobRepository,
} from "./career.types";

export class CareerCompanyRepositoryImpl implements ICareerCompanyRepository {
  public async findAll(): Promise<CareerCompanyResponse[]> {
    try {
      const companies = await CareerCompany.findAll({
        order: [["createdAt", "DESC"]],
      });

      return companies.map((company) => this.mapCompanyToResponse(company));
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number): Promise<CareerCompanyResponse | null> {
    try {
      const company = await CareerCompany.findByPk(id, {
        include: [
          {
            model: CareerJob,
            as: "jobs",
            include: [
              {
                model: User,
                as: "author",
                attributes: ["id", "username", "email"],
              },
            ],
          },
        ],
      });

      if (!company) {
        return null;
      }

      return this.mapCompanyToResponseWithJobs(company);
    } catch (error) {
      throw error;
    }
  }

  public async create(
    data: CreateCareerCompanyDto
  ): Promise<CareerCompanyResponse> {
    try {
      const company = await CareerCompany.create(data as any);
      return this.mapCompanyToResponse(company);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    data: UpdateCareerCompanyDto
  ): Promise<CareerCompanyResponse | null> {
    try {
      const [updatedCount] = await CareerCompany.update(data, {
        where: { id },
      });

      if (updatedCount === 0) {
        return null;
      }

      const updatedCompany = await CareerCompany.findByPk(id);
      return updatedCompany ? this.mapCompanyToResponse(updatedCompany) : null;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await CareerCompany.destroy({
        where: { id },
      });

      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  private mapCompanyToResponse(company: CareerCompany): CareerCompanyResponse {
    return {
      id: company.id,
      name: company.name,
      companyLogo: company.companyLogo,
      location: company.location,
      email: company.email,
      description: company.description,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  private mapCompanyToResponseWithJobs(
    company: CareerCompany
  ): CareerCompanyResponse {
    const response = this.mapCompanyToResponse(company);

    if (company.jobs) {
      response.jobs = company.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        imgUrl: job.imgUrl,
        jobType: job.jobType,
        companyId: job.companyId,
        authorId: job.authorId,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        author: job.author
          ? {
              id: job.author.id,
              username: job.author.username,
              email: job.author.email,
            }
          : undefined,
      }));
    }

    return response;
  }
}

export class CareerJobRepositoryImpl implements ICareerJobRepository {
  public async findAll(): Promise<CareerJobResponse[]> {
    try {
      const jobs = await CareerJob.findAll({
        include: [
          {
            model: CareerCompany,
            as: "company",
            attributes: ["id", "name", "location", "companyLogo"],
          },
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return jobs.map((job) => this.mapJobToResponse(job));
    } catch (error) {
      throw error;
    }
  }

  public async findAllPublic(
    query: CareerQueryDto
  ): Promise<{ jobs: CareerJobResponse[]; total: number }> {
    try {
      const { q, i, l, limit, page, sort } = query;
      const offset = (page - 1) * limit;

      const whereConditions: any = {};
      const companyWhereConditions: any = {};

      if (q) {
        whereConditions.title = {
          [Op.iLike]: `%${q}%`,
        };
      }

      if (i) {
        const jobTypes = i.split(",").map((type) => type.trim());
        whereConditions.jobType = {
          [Op.in]: jobTypes,
        };
      }

      if (l) {
        const locations = l.split(",").map((location) => location.trim());
        companyWhereConditions.location = {
          [Op.iLike]: { [Op.any]: locations.map((loc) => `%${loc}%`) },
        };
      }

      const findOptions: any = {
        where: whereConditions,
        include: [
          {
            model: CareerCompany,
            as: "company",
            attributes: ["id", "name", "location", "companyLogo"],
            where:
              Object.keys(companyWhereConditions).length > 0
                ? companyWhereConditions
                : undefined,
          },
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "email"],
          },
        ],
        order: [["createdAt", sort]],
        limit,
        offset,
      };

      const { count, rows } = await CareerJob.findAndCountAll(findOptions);

      return {
        jobs: rows.map((job) => this.mapJobToResponse(job)),
        total: count,
      };
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number): Promise<CareerJobResponse | null> {
    try {
      const job = await CareerJob.findByPk(id, {
        include: [
          {
            model: CareerCompany,
            as: "company",
            attributes: ["id", "name", "location", "companyLogo"],
          },
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      return job ? this.mapJobToResponse(job) : null;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdPublic(id: number): Promise<CareerJobResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateCareerJobDto,
    authorId: number
  ): Promise<CareerJobResponse> {
    try {
      const job = await CareerJob.create({
        ...data,
        authorId,
      });

      const createdJob = await this.findById(job.id);
      if (!createdJob) {
        throw new NotFoundError("Created job not found");
      }

      return createdJob;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    data: UpdateCareerJobDto
  ): Promise<CareerJobResponse | null> {
    try {
      const [updatedCount] = await CareerJob.update(data, {
        where: { id },
      });

      if (updatedCount === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  public async updateImage(
    id: number,
    imgUrl: string
  ): Promise<CareerJobResponse | null> {
    try {
      const [updatedCount] = await CareerJob.update(
        { imgUrl },
        { where: { id } }
      );

      if (updatedCount === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await CareerJob.destroy({
        where: { id },
      });

      return deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  private mapJobToResponse(job: CareerJob): CareerJobResponse {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      imgUrl: job.imgUrl,
      jobType: job.jobType,
      companyId: job.companyId,
      authorId: job.authorId,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      company: job.company
        ? {
            id: job.company.id,
            name: job.company.name,
            location: job.company.location,
            companyLogo: job.company.companyLogo,
          }
        : undefined,
      author: job.author
        ? {
            id: job.author.id,
            username: job.author.username,
            email: job.author.email,
          }
        : undefined,
    };
  }
}
