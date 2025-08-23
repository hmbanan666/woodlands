import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type * as tables from './tables'

export type { Database } from './connection'

export type User = InferSelectModel<typeof tables.users>
export type UserDraft = InferInsertModel<typeof tables.users>
