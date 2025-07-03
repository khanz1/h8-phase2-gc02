import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class BlogCategory extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare posts?: BlogPost[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Blog_Categories", {
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

    const options = this.getBaseOptions("Blog_Categories");
    BlogCategory.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    BlogCategory.hasMany(BlogPost, {
      foreignKey: "categoryId",
      as: "posts",
    });
  }
}

export class BlogPost extends BaseModel {
  declare id: number;
  declare title: string;
  declare content: string;
  declare imgUrl?: string;
  declare categoryId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare category?: BlogCategory;
  declare author?: User;

  public static associations: {
    category: Association<BlogPost, BlogCategory>;
    author: Association<BlogPost, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Blog_Posts", {
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
            args: [10],
            msg: "Content must be at least 10 characters",
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
          model: "Blog_Categories",
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
      ...this.getBaseOptions("Blog_Posts"),
      indexes: [
        { fields: ["category_id"] },
        { fields: ["author_id"] },
        { fields: ["created_at"] },
        { fields: ["title"] },
      ],
    };

    BlogPost.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    BlogPost.belongsTo(BlogCategory, {
      foreignKey: "categoryId",
      as: "category",
    });

    BlogPost.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
