import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { BcryptHelper } from "@/shared/utils/bcrypt.helper";

// User attributes interface matching the migration schema
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Staff" | "User";
  phoneNumber?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Optional attributes for creation
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "createdAt" | "updatedAt" | "phoneNumber" | "address"
  > {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: "Admin" | "Staff" | "User";
  declare phoneNumber?: string;
  declare address?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Instance method to compare password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    console.log(candidatePassword, this.get("password"), "<<< angga2");
    return BcryptHelper.comparePassword(candidatePassword, this.password);
  }

  // Remove password from JSON output
  public toJSON(): Omit<UserAttributes, "password"> {
    const values = { ...this.get() } as any;
    delete values.password;
    return values;
  }

  public static initialize(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          validate: {
            len: {
              args: [3, 50],
              msg: "Username must be between 3 and 50 characters",
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
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: "Staff",
          validate: {
            isIn: {
              args: [["Admin", "Staff", "User"]],
              msg: "Role must be Admin, Staff, or User",
            },
          },
        },
        phoneNumber: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: "phone_number",
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: "updated_at",
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: true,
        underscored: true,
        hooks: {
          beforeCreate: async (user: User) => {
            if (user.password) {
              user.password = await BcryptHelper.hashPassword(user.password);
            }
          },
          beforeUpdate: async (user: User) => {
            if (user.changed("password")) {
              user.password = await BcryptHelper.hashPassword(user.password);
            }
          },
        },
      }
    );
  }

  public static associate(): void {
    // User associations will be added here as needed
    // For example: User.hasMany(BlogPost, { foreignKey: 'authorId', as: 'posts' });
  }
}
