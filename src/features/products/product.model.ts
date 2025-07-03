import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class BrandedCategory extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare products?: BrandedProduct[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Branded_Categories", {
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

    const options = this.getBaseOptions("Branded_Categories");
    BrandedCategory.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    BrandedCategory.hasMany(BrandedProduct, {
      foreignKey: "categoryId",
      as: "products",
    });
  }
}

export class BrandedProduct extends BaseModel {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare stock: number;
  declare imgUrl?: string;
  declare categoryId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare category?: BrandedCategory;
  declare author?: User;

  public static associations: {
    category: Association<BrandedProduct, BrandedCategory>;
    author: Association<BrandedProduct, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Branded_Products", {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: "Product name must be between 2 and 255 characters",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [10],
            msg: "Description must be at least 10 characters",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Price must be greater than 0",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Stock cannot be negative",
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
          model: "Branded_Categories",
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
      ...this.getBaseOptions("Branded_Products"),
      indexes: [
        { fields: ["category_id"] },
        { fields: ["author_id"] },
        { fields: ["price"] },
        { fields: ["stock"] },
        { fields: ["name"] },
      ],
    };

    BrandedProduct.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    BrandedProduct.belongsTo(BrandedCategory, {
      foreignKey: "categoryId",
      as: "category",
    });

    BrandedProduct.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
