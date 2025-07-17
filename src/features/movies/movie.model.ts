import { DataTypes, Sequelize, Association } from "sequelize";
import { BaseModel } from "@/database/models/BaseModel";
import { User } from "@/features/users/user.model";

export class MovieGenre extends BaseModel {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare movies?: Movie[];

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Movie_Genres", {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [2, 50],
            msg: "Genre name must be between 2 and 50 characters",
          },
        },
      },
    });

    const options = this.getBaseOptions("Movie_Genres");
    MovieGenre.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    MovieGenre.hasMany(Movie, {
      foreignKey: "genreId",
      as: "movies",
    });
  }
}

export class Movie extends BaseModel {
  declare id: number;
  declare title: string;
  declare synopsis: string;
  declare trailerUrl?: string;
  declare imgUrl?: string;
  declare rating: number;
  declare genreId: number;
  declare authorId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare genre?: MovieGenre;
  declare author?: User;

  public static associations: {
    genre: Association<Movie, MovieGenre>;
    author: Association<Movie, User>;
  };

  public static initialize(sequelize: Sequelize): void {
    const attributes = this.initializeBase(sequelize, "Movie_Movies", {
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          len: {
            args: [1, 500],
            msg: "Title must be between 1 and 500 characters",
          },
        },
      },
      synopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [20],
            msg: "Synopsis must be at least 20 characters",
          },
        },
      },
      trailerUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "trailer_url",
      },
      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "img_url",
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Rating must be at least 1",
          },
          max: {
            args: [10],
            msg: "Rating cannot be more than 10",
          },
        },
      },
      genreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "genre_id",
        references: {
          model: "Movie_Genres",
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
      ...this.getBaseOptions("Movie_Movies"),
      indexes: [
        { fields: ["genre_id"] },
        { fields: ["author_id"] },
        { fields: ["rating"] },
        { fields: ["title"] },
      ],
    };

    Movie.init(attributes, { sequelize, ...options });
  }

  public static associate(): void {
    Movie.belongsTo(MovieGenre, {
      foreignKey: "genreId",
      as: "genre",
    });

    Movie.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  }
}
