import dotenv from 'dotenv';

dotenv.config();

export const {
    APP_PORT,
    PRISUMEDB,
    JWT_SECRET
} = process.env;