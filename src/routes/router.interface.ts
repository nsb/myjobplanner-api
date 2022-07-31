import { Router } from 'express'

export interface IRouter {
    createRouter: () => Router
  }
