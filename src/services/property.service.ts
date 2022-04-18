import * as s from 'zapatos/schema'
import { BaseService, IService } from './base.service'

export interface IPropertyService extends IService<
  s.properties.Insertable,
  s.properties.Updatable,
  s.properties.JSONSelectable,
  s.properties.Whereable,
  s.properties.Table
> {}

class PropertyService extends BaseService<
  s.properties.Insertable,
  s.properties.Updatable,
  s.properties.JSONSelectable,
  s.properties.Whereable,
  s.properties.Table
> {
    public static inject = ['pool', 'propertyRepository'] as const;
}

export default PropertyService
