import BaseRepository from "../repository"
import Business from "../models/Business"

export class BusinessRepository extends BaseRepository<Business> {
  create(item: Business): Promise<boolean> {
    return Promise.resolve(true)
  }
}