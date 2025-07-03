import { Op } from "sequelize";
import { Anime } from "./lecture.model";
import { User } from "@/features/users/user.model";
import {
  IAnimeRepository,
  AnimeResponse,
  CreateAnimeDto,
  UpdateAnimeDto,
  AnimeQueryDto,
} from "./lecture.types";

export class AnimeRepository implements IAnimeRepository {
  public async findAll(): Promise<AnimeResponse[]> {
    const animes = await Anime.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return animes.map((anime) => this.mapAnimeToResponse(anime));
  }

  public async findAllPublic(
    query: AnimeQueryDto
  ): Promise<{ animes: AnimeResponse[]; total: number }> {
    const { q, limit, page, sort } = query;
    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    if (q) {
      whereCondition.title = {
        [Op.iLike]: `%${q}%`,
      };
    }

    const { rows: animes, count: total } = await Anime.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", sort]],
      distinct: true,
    });

    return {
      animes: animes.map((anime) => this.mapAnimeToResponse(anime)),
      total,
    };
  }

  public async findById(id: number): Promise<AnimeResponse | null> {
    const anime = await Anime.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!anime) {
      return null;
    }

    return this.mapAnimeToResponse(anime);
  }

  public async findByIdPublic(id: number): Promise<AnimeResponse | null> {
    return this.findById(id);
  }

  public async create(
    data: CreateAnimeDto,
    authorId: number
  ): Promise<AnimeResponse> {
    const anime = await Anime.create({
      ...data,
      authorId,
    });

    const animeWithAuthor = await Anime.findByPk(anime.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    return this.mapAnimeToResponse(animeWithAuthor!);
  }

  public async update(
    id: number,
    data: UpdateAnimeDto
  ): Promise<AnimeResponse | null> {
    const [updatedCount] = await Anime.update(data, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async updateImage(
    id: number,
    coverUrl: string
  ): Promise<AnimeResponse | null> {
    const [updatedCount] = await Anime.update({ coverUrl }, { where: { id } });

    if (updatedCount === 0) {
      return null;
    }

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const deletedCount = await Anime.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  private mapAnimeToResponse(anime: Anime): AnimeResponse {
    return {
      id: anime.id,
      title: anime.title,
      synopsis: anime.synopsis,
      coverUrl: anime.coverUrl,
      authorId: anime.authorId,
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
      author: anime.author
        ? {
            id: anime.author.id,
            username: anime.author.username,
            email: anime.author.email,
          }
        : null,
    };
  }
}
