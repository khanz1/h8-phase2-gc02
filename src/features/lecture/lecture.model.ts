import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class Anime extends BaseModel {
  declare id: number;
  declare title: string;
  declare synopsis: string;
  declare coverUrl?: string;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare author?: User;

  public static associations: {
    author: Association<Anime, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    Anime.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(200),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Title cannot be empty",
            },
            len: {
              args: [1, 200],
              msg: "Title must be between 1 and 200 characters",
            },
          },
        },
        synopsis: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Synopsis cannot be empty",
            },
            len: {
              args: [10, 5000],
              msg: "Synopsis must be between 10 and 5000 characters",
            },
          },
        },
        coverUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          validate: {
            isUrl: {
              msg: "Cover URL must be a valid URL",
            },
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Anime",
        tableName: "Animes",
        timestamps: true,
        indexes: [
          {
            fields: ["title"],
          },
        ],
      }
    );
  }

  public static associate(): void {}

  public toJSON(): object {
    const values = { ...this.get() };
    return values;
  }
}
