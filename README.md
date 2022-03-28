# News API

## Initial Setup

Initiate your project by using the npm i command.

```
npm run setup-dbs
```

You will need to create two .env files for your project: `.env.test` and `.env.development`. 
Add `PGDATABASE=nc_news_test` to  `.env.test` and  add `PGDATABASE=nc_news` to `.env.development`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.


You have also been provided with a db folder with some data, a `setup.sql` file and a seeds folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

Run this command to create the databases
```
npm run setup-dbs
```

