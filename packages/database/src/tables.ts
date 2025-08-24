import { cuid2 } from 'drizzle-cuid2/postgres'
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: cuid2('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).notNull().defaultNow(),
  telegramId: varchar('telegram_id').notNull(),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  username: varchar('username'),
  languageCode: varchar('language_code'),
  coins: integer('coins').notNull().default(0),
})
