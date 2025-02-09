// db/config.ts
import { column, defineDb, defineTable } from "astro:db";
  
const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true, unique: true }),
    username: column.text({ unique: true }),
    password: column.text({ optional: true}),
    github_id: column.text({ optional: true, unique: true }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ optional: false,unique: true }),
    userId: column.text({ references: () => User.columns.id, optional: false }),
    expiresAt: column.number({ optional: false }),
  },
});

export default defineDb({
  tables: {
    User,
    Session,
  },
});
