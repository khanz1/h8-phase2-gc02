import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class RestaurantCategory extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare cuisines?: RestaurantCuisine[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Restaurant_Categories", {
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

    const options = this.getBaseOptions("Restaurant_Categories");
    RestaurantCategory.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    RestaurantCategory.hasMany(RestaurantCuisine, {
      foreignKey: "categoryId",
      as: "cuisines",
    });
  }
}

export class RestaurantCuisine extends BaseModel {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imgUrl: string;
  declare categoryId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare category?: RestaurantCategory;
  declare author?: User;

  public static associations: {
    category: Association<RestaurantCuisine, RestaurantCategory>;
    author: Association<RestaurantCuisine, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Restaurant_Cuisines", {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: "Cuisine name must be between 2 and 255 characters",
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
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "img_url",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_id",
        references: {
          model: "Restaurant_Categories",
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
      ...this.getBaseOptions("Restaurant_Cuisines"),
      indexes: [
        { fields: ["category_id"] },
        { fields: ["author_id"] },
        { fields: ["price"] },
        { fields: ["name"] },
      ],
    };

    RestaurantCuisine.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    RestaurantCuisine.belongsTo(RestaurantCategory, {
      foreignKey: "categoryId",
      as: "category",
    });

    RestaurantCuisine.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
