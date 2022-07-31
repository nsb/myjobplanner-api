import 'reflect-metadata'
import { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'
import { Container } from 'inversify'
import Authorization from './authorization'
import BusinessController from './controllers/business.controllers'
import openApi from './openapi'
import pool from './postgres'
import BusinessRepository, { IBusinessRepository } from './repositories/BusinessRepository'
import EmployeeRepository, { IEmployeeRepository } from './repositories/EmployeRepository'
import BusinessService, { IBusinessService } from './services/business.service'

const container = new Container()
container.bind('pool').toConstantValue(pool)
container.bind<OpenApiRequestHandler[]>('openApi').toConstantValue(openApi)
container.bind('authorization').to(Authorization)
container.bind<IEmployeeRepository>('employeeRepository').to(EmployeeRepository)
container.bind<IBusinessRepository>('businessRepository').to(BusinessRepository)
container.bind<IBusinessService>('businessServices').to(BusinessService)
container.bind('businessController').to(BusinessController)
// myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja)
// myContainer.bind<Weapon>(TYPES.Weapon).to(Katana)
// myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken)

export default container
