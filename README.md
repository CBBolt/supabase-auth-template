# Supabase | Auth Template

This template provides a minimal setup to get up and going with a basic auth setup and connection to Supabase.

## Supabase Setup

_There is some additional setup to get the template working, this mainly involves creating a new project in Supabase and
setting up the proper tables_

1. Create a new project in Supabase
   _Make sure to keep note of the URL and API key as those will be needed later_

2. 2 Tables are required for this template with the below columns and types
   **profiles**
   id (uuid) [Change from int8 by default from Supabase]
   username (text)
   auth_id (uuid) [Foreign key to auth.id]

**health**

_This is a dummy table used to get the health of Supabase and see if it's reachable. The contents of the table are irrevelant, what matters is that it is publicly accessible_

3. Next setup the below profiles for the Supabase tables

**profiles**

INSERT - public role (Allows public users to create profiles)

_using_: true

ALL - authenticated role (Allows authenticated users to view their profile)

_using & check_: (auth_id = ( SELECT auth.uid() AS uid))

**health**

SELECT - public role (Allows public users to see if the database is accessible)

4. Create a .env file in the project and add the below variables

**VITE_SUPABASE_URL**

**VITE_SUPABASE_ANON_KEY**

## Fetch DB Data Function

This function is meant to be very generic so other database providers can be used as long as the format follows the below:

```
{
    method: 'SELECT',
    datasource: 'testing',
    columns: '*',
}

```

**Additional Information**

    method: SELECT, UPDATE, UPSERT, INSERT, DELETE
    filters: An array of FilterQueryType
        Ex: {column: 'age', operator: 'eq', value: 'Carter'}
    order: A column to order by (CURRENT IMPLEMENTATION ONLY SUPPORTS 1)
    addlKeywords: An object used to allow for other query modifiers
        NOTE: Currently only supports SINGLE which returns one item
