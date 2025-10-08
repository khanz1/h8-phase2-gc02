import { z } from "zod";

export const createCareerCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name cannot exceed 255 characters")
    .trim(),
  companyLogo: z.string().url("Invalid company logo URL"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(255, "Location cannot exceed 255 characters")
    .trim(),
  email: z.string().email("Invalid email address"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
});

export const updateCareerCompanySchema = createCareerCompanySchema;

export const createCareerJobSchema = z.object({
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(500, "Job title cannot exceed 500 characters")
    .trim(),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .trim(),
  imgUrl: z.string().url("Invalid image URL"),
  jobType: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
  ]),
  companyId: z
    .number()
    .int("Company ID must be an integer")
    .positive("Company ID must be positive"),
});

export const updateCareerJobSchema = createCareerJobSchema;

export const careerQuerySchema = z.object({
  q: z.string().optional().describe("Search query for job title"),
  i: z.string().optional().describe("Search query for company name"),
  limit: z.coerce
    .number()
    .int()
    .min(4, "Limit must be at least 4")
    .max(12, "Limit cannot exceed 12")
    .default(10),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  sort: z.enum(["ASC", "DESC"]).default("DESC"),
});

export interface CreateCareerCompanyDto {
  name: string;
  companyLogo: string;
  location: string;
  email: string;
  description: string;
}

export interface UpdateCareerCompanyDto {
  name: string;
  companyLogo: string;
  location: string;
  email: string;
  description: string;
}

export interface CreateCareerJobDto {
  title: string;
  description: string;
  imgUrl: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";
  companyId: number;
}

export interface UpdateCareerJobDto {
  title: string;
  description: string;
  imgUrl: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";
  companyId: number;
}

export interface CareerQueryDto {
  q?: string;
  i?: string;
  limit: number;
  page: number;
  sort: "ASC" | "DESC";
}

export interface CareerCompanyResponse {
  id: number;
  name: string;
  companyLogo: string;
  location: string;
  email: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  jobs?: CareerJobResponse[];
}

export interface CareerJobResponse {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
  jobType: "Full-Time" | "Part-Time" | "Contract" | "Internship" | "Remote" | "Project-Based";
  companyId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: number;
    name: string;
    location: string;
    companyLogo: string;
  } | null;
  author?: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface PaginatedCareerJobsResponse {
  data: CareerJobResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginatedCareerCompaniesResponse {
  data: CareerCompanyResponse[];
}

export interface ICareerCompanyRepository {
  findAll(): Promise<CareerCompanyResponse[]>;
  findById(id: number): Promise<CareerCompanyResponse | null>;
  create(data: CreateCareerCompanyDto): Promise<CareerCompanyResponse>;
  update(
    id: number,
    data: UpdateCareerCompanyDto
  ): Promise<CareerCompanyResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface ICareerJobRepository {
  findAll(): Promise<CareerJobResponse[]>;
  findAllPublic(
    query: CareerQueryDto
  ): Promise<{ jobs: CareerJobResponse[]; total: number }>;
  findById(id: number): Promise<CareerJobResponse | null>;
  findByIdPublic(id: number): Promise<CareerJobResponse | null>;
  create(
    data: CreateCareerJobDto,
    authorId: number
  ): Promise<CareerJobResponse>;
  update(
    id: number,
    data: UpdateCareerJobDto
  ): Promise<CareerJobResponse | null>;
  updateImage(id: number, imgUrl: string): Promise<CareerJobResponse | null>;
  delete(id: number): Promise<boolean>;
}

export interface ICareerCompanyService {
  getAllCompanies(): Promise<CareerCompanyResponse[]>;
  getCompanyById(id: number): Promise<CareerCompanyResponse>;
  createCompany(data: CreateCareerCompanyDto): Promise<CareerCompanyResponse>;
  updateCompany(
    id: number,
    data: UpdateCareerCompanyDto
  ): Promise<CareerCompanyResponse>;
  deleteCompany(id: number): Promise<void>;
}

export interface ICareerJobService {
  getAllJobs(): Promise<CareerJobResponse[]>;
  getAllJobsPublic(query: CareerQueryDto): Promise<PaginatedCareerJobsResponse>;
  getJobById(id: number): Promise<CareerJobResponse>;
  getJobByIdPublic(id: number): Promise<CareerJobResponse>;
  createJob(
    data: CreateCareerJobDto,
    authorId: number
  ): Promise<CareerJobResponse>;
  updateJob(id: number, data: UpdateCareerJobDto): Promise<CareerJobResponse>;
  updateJobImage(id: number, imgUrl: string): Promise<CareerJobResponse>;
  deleteJob(id: number): Promise<void>;
}
