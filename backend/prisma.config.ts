import "dotenv/config";
import { defineConfig, env } from "prisma/config";

console.log("Current Directory:", process.cwd());
console.log("DATABASE_URL env:", process.env.DATABASE_URL);

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env.DATABASE_URL || env("DATABASE_URL"),
    },
});
