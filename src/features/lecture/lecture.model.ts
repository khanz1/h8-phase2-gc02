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

  declare author?: User;

  public static associations: {
    author: Association<Anime, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Animes", {
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
        field: "cover_url",
        validate: {
          isUrl: {
            msg: "Cover URL must be a valid URL",
          },
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    const options = {
      ...this.getBaseOptions("Animes"),
      indexes: [
        {
          fields: ["author_id"],
        },
        {
          fields: ["title"],
        },
        {
          fields: ["created_at"],
        },
      ],
    };

    Anime.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    Anime.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }

  public toJSON(): object {
    const values = { ...this.get() };
    return values;
  }
}
