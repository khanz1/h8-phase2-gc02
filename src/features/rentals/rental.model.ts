import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class RentalType extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare transportations?: RentalTransportation[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Rental_Types", {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [2, 50],
            msg: "Type name must be between 2 and 50 characters",
          },
        },
      },
    });

    const options = this.getBaseOptions("Rental_Types");
    RentalType.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    RentalType.hasMany(RentalTransportation, {
      foreignKey: "typeId",
      as: "transportations",
    });
  }
}

export class RentalTransportation extends BaseModel {
  declare id: number;
  declare name: string;
  declare description: string;
  declare imgUrl?: string;
  declare location: string;
  declare price: number;
  declare typeId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare type?: RentalType;
  declare author?: User;

  public static associations: {
    type: Association<RentalTransportation, RentalType>;
    author: Association<RentalTransportation, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(
      sequelize,
      "Rental_Transportations",
      {
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            len: {
              args: [2, 255],
              msg: "Transportation name must be between 2 and 255 characters",
            },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        imgUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "img_url",
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
        typeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "type_id",
          references: {
            model: "Rental_Types",
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
      }
    );

    const options = {
      ...this.getBaseOptions("Rental_Transportations"),
      indexes: [
        { fields: ["type_id"] },
        { fields: ["author_id"] },
        { fields: ["price"] },
        { fields: ["location"] },
      ],
    };

    RentalTransportation.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    RentalTransportation.belongsTo(RentalType, {
      foreignKey: "typeId",
      as: "type",
    });

    RentalTransportation.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
