import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class NewsCategory extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare articles?: NewsArticle[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "News_Categories", {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [2, 100],
            msg: "Category name must be between 2 and 100 characters",
          },
        },
      },
    });

    const options = this.getBaseOptions("News_Categories");
    NewsCategory.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    NewsCategory.hasMany(NewsArticle, {
      foreignKey: "categoryId",
      as: "articles",
    });
  }
}

export class NewsArticle extends BaseModel {
  declare id: number;
  declare title: string;
  declare content: string;
  declare imgUrl?: string;
  declare categoryId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare category?: NewsCategory;
  declare author?: User;

  public static associations: {
    category: Association<NewsArticle, NewsCategory>;
    author: Association<NewsArticle, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "News_Articles", {
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          len: {
            args: [2, 500],
            msg: "Title must be between 2 and 500 characters",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [50],
            msg: "Content must be at least 50 characters",
          },
        },
      },
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "img_url",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_id",
        references: {
          model: "News_Categories",
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
      ...this.getBaseOptions("News_Articles"),
      indexes: [
        { fields: ["category_id"] },
        { fields: ["author_id"] },
        { fields: ["created_at"] },
        { fields: ["title"] },
      ],
    };

    NewsArticle.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    NewsArticle.belongsTo(NewsCategory, {
      foreignKey: "categoryId",
      as: "category",
    });

    NewsArticle.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
