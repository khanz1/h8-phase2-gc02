import { NotFoundError } from "@/shared/errors";
import { AnimeRepository } from "./lecture.repository";
import {
  IAnimeService,
  AnimeResponse,
  CreateAnimeDto,
  UpdateAnimeDto,
  AnimeQueryDto,
  PaginatedAnimesResponse,
} from "./lecture.types";

export class AnimeService implements IAnimeService {
  constructor(private readonly animeRepository: AnimeRepository) {}

  public async getAllAnimes(): Promise<AnimeResponse[]> {
    return this.animeRepository.findAll();
  }

  public async getAllAnimesPublic(
    query: AnimeQueryDto
  ): Promise<PaginatedAnimesResponse> {
    const { animes, total } = await this.animeRepository.findAllPublic(query);

    const { page, limit } = query;
    const totalPages = Math.ceil(total / limit);

    return {
      animes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  public async getAnimeById(id: number): Promise<AnimeResponse> {
    const anime = await this.animeRepository.findById(id);

    if (!anime) {
      throw new NotFoundError(`Anime with ID ${id} not found`);
    }

    return anime;
  }

  public async getAnimeByIdPublic(id: number): Promise<AnimeResponse> {
    const anime = await this.animeRepository.findByIdPublic(id);

    if (!anime) {
      throw new NotFoundError(`Anime with ID ${id} not found`);
    }

    return anime;
  }

  public async createAnime(
    data: CreateAnimeDto,
    authorId: number
  ): Promise<AnimeResponse> {
    return this.animeRepository.create(data, authorId);
  }

  public async updateAnime(
    id: number,
    data: UpdateAnimeDto
  ): Promise<AnimeResponse> {
    const updatedAnime = await this.animeRepository.update(id, data);

    if (!updatedAnime) {
      throw new NotFoundError(`Anime with ID ${id} not found`);
    }

    return updatedAnime;
  }

  public async updateAnimeImage(
    id: number,
    coverUrl: string
  ): Promise<AnimeResponse> {
    const updatedAnime = await this.animeRepository.updateImage(id, coverUrl);

    if (!updatedAnime) {
      throw new NotFoundError(`Anime with ID ${id} not found`);
    }

    return updatedAnime;
  }

  public async deleteAnime(id: number): Promise<void> {
    const deleted = await this.animeRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Anime with ID ${id} not found`);
    }
  }
}
