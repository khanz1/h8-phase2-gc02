import { Model, DataTypes, Sequelize } from "sequelize";

export abstract class BaseModel extends Model {
  declare id: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  /**
   * Ensure base attributes are included in JSON serialization
   */
  public toJSON(): any {
    const values = { ...this.get() };
    return values;
  }

  /**
   * Initialize the base model with common attributes
   */
  protected static initializeBase(
    sequelize: Sequelize,
    tableName: string,
    additionalAttributes: Record<string, any> = {}
  ): Record<string, any> {
    const baseAttributes = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
    };

    return {
      ...baseAttributes,
      ...additionalAttributes,
    };
  }

  /**
   * Get common model options
   */
  protected static getBaseOptions(tableName: string): Record<string, any> {
    return {
      tableName,
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    };
  }
}
