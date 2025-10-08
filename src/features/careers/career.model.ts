import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class CareerCompany extends BaseModel {
  declare id: number;
  declare name: string;
  declare companyLogo: string;
  declare location: string;
  declare email: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare jobs?: CareerJob[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Career_Companies", {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [2, 255],
            msg: "Company name must be between 2 and 255 characters",
          },
        },
      },
      companyLogo: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "company_logo",
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: "Location must be between 2 and 255 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });

    const options = {
      ...this.getBaseOptions("Career_Companies"),
      indexes: [{ fields: ["email"] }, { fields: ["location"] }],
    };

    CareerCompany.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    CareerCompany.hasMany(CareerJob, {
      foreignKey: "companyId",
      as: "jobs",
    });
  }
}

export class CareerJob extends BaseModel {
  declare id: number;
  declare title: string;
  declare description: string;
  declare imgUrl: string;
  declare jobType:
    | "Full-Time"
    | "Part-Time"
    | "Contract"
    | "Internship"
    | "Remote"
    | "Project-Based";
  declare companyId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare company?: CareerCompany;
  declare author?: User;

  public static associations: {
    company: Association<CareerJob, CareerCompany>;
    author: Association<CareerJob, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Career_Jobs", {
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          len: {
            args: [3, 500],
            msg: "Job title must be between 3 and 500 characters",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [50],
            msg: "Description must be at least 50 characters",
          },
        },
      },
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "img_url",
      },
      jobType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "job_type",
        validate: {
          isIn: {
            args: [
              ["Full-Time", "Part-Time", "Contract", "Internship", "Remote", "Project-Based"],
            ],
            msg: "Job type must be Full-Time, Part-Time, Contract, Internship, Remote, or Project-Based",
          },
        },
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "company_id",
        references: {
          model: "Career_Companies",
          key: "id",
        },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "author_id",
        references: {
          model: "Users",
          key: "id",
        },
      },
    });

    const options = {
      ...this.getBaseOptions("Career_Jobs"),
      indexes: [
        { fields: ["company_id"] },
        { fields: ["author_id"] },
        { fields: ["job_type"] },
        { fields: ["title"] },
      ],
    };

    CareerJob.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    CareerJob.belongsTo(CareerCompany, {
      foreignKey: "companyId",
      as: "company",
    });

    CareerJob.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
