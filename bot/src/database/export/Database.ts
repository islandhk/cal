import Database from "../Database";

const database = new Database();
export const prisma = database.new();
