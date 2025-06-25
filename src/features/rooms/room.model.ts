import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class RoomType extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare lodgings?: RoomLodging[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Room_Types", {
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

    const options = this.getBaseOptions("Room_Types");
    RoomType.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    RoomType.hasMany(RoomLodging, {
      foreignKey: "typeId",
      as: "lodgings",
    });
  }
}

export class RoomLodging extends BaseModel {
  declare id: number;
  declare name: string;
  declare facility: string;
  declare roomCapacity: number;
  declare imgUrl: string;
  declare location: string;
  declare typeId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare type?: RoomType;
  declare author?: User;

  public static associations: {
    type: Association<RoomLodging, RoomType>;
    author: Association<RoomLodging, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Room_Lodgings", {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: "Lodging name must be between 2 and 255 characters",
          },
        },
      },
      facility: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      roomCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "room_capacity",
        validate: {
          min: {
            args: [1],
            msg: "Room capacity must be greater than 0",
          },
        },
      },
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "type_id",
        references: {
          model: "Room_Types",
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
      ...this.getBaseOptions("Room_Lodgings"),
      indexes: [
        { fields: ["type_id"] },
        { fields: ["author_id"] },
        { fields: ["room_capacity"] },
        { fields: ["location"] },
      ],
    };

    RoomLodging.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    RoomLodging.belongsTo(RoomType, {
      foreignKey: "typeId",
      as: "type",
    });

    RoomLodging.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
