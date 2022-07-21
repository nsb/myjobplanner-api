import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['build/'],
  rootDir: 'tests/'
}

export default config
