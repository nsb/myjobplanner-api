/*
** DON'T EDIT THIS FILE **
It's been generated by Zapatos (v5.0.0), and is liable to be overwritten

Zapatos: https://jawj.github.io/zapatos/
Copyright (C) 2020 - 2021 George MacKerron
Released under the MIT licence: see LICENCE file
*/

declare module 'zapatos/schema' {

  import type * as db from 'zapatos/db';

  // got a type error on schemaVersionCanary below? update by running `npx zapatos`
  export interface schemaVersionCanary extends db.SchemaVersionCanary { version: 103 }

  /* === schema: public === */

  /* --- enums --- */


  /* --- tables --- */

  /**
   * **businesses**
   * - Table in database
   */
  export namespace businesses {
    export type Table = 'businesses';
    export interface Selectable {
      /**
      * **businesses.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('businesses_id_seq'::regclass)`
      */
      id: number;
      /**
      * **businesses.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **businesses.timezone**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      timezone: string;
      /**
      * **businesses.country_code**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      country_code: string;
      /**
      * **businesses.vat_number**
      * - `varchar` in database
      * - Nullable, no default
      */
      vat_number: string | null;
      /**
      * **businesses.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created: Date | null;
    }
    export interface JSONSelectable {
      /**
      * **businesses.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('businesses_id_seq'::regclass)`
      */
      id: number;
      /**
      * **businesses.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **businesses.timezone**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      timezone: string;
      /**
      * **businesses.country_code**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      country_code: string;
      /**
      * **businesses.vat_number**
      * - `varchar` in database
      * - Nullable, no default
      */
      vat_number: string | null;
      /**
      * **businesses.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created: db.TimestampTzString | null;
    }
    export interface Whereable {
      /**
      * **businesses.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('businesses_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **businesses.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **businesses.timezone**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      timezone?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **businesses.country_code**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      country_code?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **businesses.vat_number**
      * - `varchar` in database
      * - Nullable, no default
      */
      vat_number?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **businesses.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **businesses.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('businesses_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment;
      /**
      * **businesses.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **businesses.timezone**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      timezone: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **businesses.country_code**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      country_code: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **businesses.vat_number**
      * - `varchar` in database
      * - Nullable, no default
      */
      vat_number?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
      /**
      * **businesses.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **businesses.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('businesses_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.DefaultType | db.SQLFragment>;
      /**
      * **businesses.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **businesses.timezone**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      timezone?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **businesses.country_code**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      country_code?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **businesses.vat_number**
      * - `varchar` in database
      * - Nullable, no default
      */
      vat_number?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **businesses.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'businesses_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /**
   * **employees**
   * - Table in database
   */
  export namespace employees {
    export type Table = 'employees';
    export interface Selectable {
      /**
      * **employees.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('employees_id_seq'::regclass)`
      */
      id: number;
      /**
      * **employees.user_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      user_id: number;
      /**
      * **employees.business_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      business_id: number;
      /**
      * **employees.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created: Date | null;
    }
    export interface JSONSelectable {
      /**
      * **employees.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('employees_id_seq'::regclass)`
      */
      id: number;
      /**
      * **employees.user_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      user_id: number;
      /**
      * **employees.business_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      business_id: number;
      /**
      * **employees.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created: db.TimestampTzString | null;
    }
    export interface Whereable {
      /**
      * **employees.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('employees_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **employees.user_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      user_id?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **employees.business_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      business_id?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **employees.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **employees.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('employees_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment;
      /**
      * **employees.user_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      user_id: number | db.Parameter<number> | db.SQLFragment;
      /**
      * **employees.business_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      business_id: number | db.Parameter<number> | db.SQLFragment;
      /**
      * **employees.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **employees.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('employees_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.DefaultType | db.SQLFragment>;
      /**
      * **employees.user_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      user_id?: number | db.Parameter<number> | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment>;
      /**
      * **employees.business_id**
      * - `int4` in database
      * - `NOT NULL`, no default
      */
      business_id?: number | db.Parameter<number> | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment>;
      /**
      * **employees.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'employees_pkey' | 'employees_user_id_business_id_key';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /**
   * **users**
   * - Table in database
   */
  export namespace users {
    export type Table = 'users';
    export interface Selectable {
      /**
      * **users.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('users_id_seq'::regclass)`
      */
      id: number;
      /**
      * **users.user_id**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      user_id: string;
      /**
      * **users.picture**
      * - `varchar` in database
      * - Nullable, no default
      */
      picture: string | null;
      /**
      * **users.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **users.email**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      email: string;
      /**
      * **users.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created: Date | null;
    }
    export interface JSONSelectable {
      /**
      * **users.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('users_id_seq'::regclass)`
      */
      id: number;
      /**
      * **users.user_id**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      user_id: string;
      /**
      * **users.picture**
      * - `varchar` in database
      * - Nullable, no default
      */
      picture: string | null;
      /**
      * **users.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name: string;
      /**
      * **users.email**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      email: string;
      /**
      * **users.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created: db.TimestampTzString | null;
    }
    export interface Whereable {
      /**
      * **users.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('users_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, number | db.Parameter<number> | db.SQLFragment | db.ParentColumn>;
      /**
      * **users.user_id**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      user_id?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **users.picture**
      * - `varchar` in database
      * - Nullable, no default
      */
      picture?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **users.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **users.email**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      email?: string | db.Parameter<string> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment | db.ParentColumn>;
      /**
      * **users.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | db.SQLFragment | db.ParentColumn>;
    }
    export interface Insertable {
      /**
      * **users.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('users_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment;
      /**
      * **users.user_id**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      user_id: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **users.picture**
      * - `varchar` in database
      * - Nullable, no default
      */
      picture?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment;
      /**
      * **users.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **users.email**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      email: string | db.Parameter<string> | db.SQLFragment;
      /**
      * **users.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment;
    }
    export interface Updatable {
      /**
      * **users.id**
      * - `int4` in database
      * - `NOT NULL`, default: `nextval('users_id_seq'::regclass)`
      */
      id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment | db.SQLFragment<any, number | db.Parameter<number> | db.DefaultType | db.SQLFragment>;
      /**
      * **users.user_id**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      user_id?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **users.picture**
      * - `varchar` in database
      * - Nullable, no default
      */
      picture?: string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | null | db.DefaultType | db.SQLFragment>;
      /**
      * **users.name**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      name?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **users.email**
      * - `varchar` in database
      * - `NOT NULL`, no default
      */
      email?: string | db.Parameter<string> | db.SQLFragment | db.SQLFragment<any, string | db.Parameter<string> | db.SQLFragment>;
      /**
      * **users.created**
      * - `timestamptz` in database
      * - Nullable, default: `now()`
      */
      created?: (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment | db.SQLFragment<any, (db.TimestampTzString | Date) | db.Parameter<(db.TimestampTzString | Date)> | null | db.DefaultType | db.SQLFragment>;
    }
    export type UniqueIndex = 'users_pkey';
    export type Column = keyof Selectable;
    export type OnlyCols<T extends readonly Column[]> = Pick<Selectable, T[number]>;
    export type SQLExpression = db.GenericSQLExpression | db.ColumnNames<Updatable | (keyof Updatable)[]> | db.ColumnValues<Updatable> | Table | Whereable | Column;
    export type SQL = SQLExpression | SQLExpression[];
  }

  /* === cross-table types === */

  export type Table = businesses.Table | employees.Table | users.Table;
  export type Selectable = businesses.Selectable | employees.Selectable | users.Selectable;
  export type JSONSelectable = businesses.JSONSelectable | employees.JSONSelectable | users.JSONSelectable;
  export type Whereable = businesses.Whereable | employees.Whereable | users.Whereable;
  export type Insertable = businesses.Insertable | employees.Insertable | users.Insertable;
  export type Updatable = businesses.Updatable | employees.Updatable | users.Updatable;
  export type UniqueIndex = businesses.UniqueIndex | employees.UniqueIndex | users.UniqueIndex;
  export type Column = businesses.Column | employees.Column | users.Column;
  export type AllBaseTables = [businesses.Table, employees.Table, users.Table];
  export type AllForeignTables = [];
  export type AllViews = [];
  export type AllMaterializedViews = [];
  export type AllTablesAndViews = [businesses.Table, employees.Table, users.Table];


  export type SelectableForTable<T extends Table> = {
    businesses: businesses.Selectable;
    employees: employees.Selectable;
    users: users.Selectable;
  }[T];

  export type JSONSelectableForTable<T extends Table> = {
    businesses: businesses.JSONSelectable;
    employees: employees.JSONSelectable;
    users: users.JSONSelectable;
  }[T];

  export type WhereableForTable<T extends Table> = {
    businesses: businesses.Whereable;
    employees: employees.Whereable;
    users: users.Whereable;
  }[T];

  export type InsertableForTable<T extends Table> = {
    businesses: businesses.Insertable;
    employees: employees.Insertable;
    users: users.Insertable;
  }[T];

  export type UpdatableForTable<T extends Table> = {
    businesses: businesses.Updatable;
    employees: employees.Updatable;
    users: users.Updatable;
  }[T];

  export type UniqueIndexForTable<T extends Table> = {
    businesses: businesses.UniqueIndex;
    employees: employees.UniqueIndex;
    users: users.UniqueIndex;
  }[T];

  export type ColumnForTable<T extends Table> = {
    businesses: businesses.Column;
    employees: employees.Column;
    users: users.Column;
  }[T];

  export type SQLForTable<T extends Table> = {
    businesses: businesses.SQL;
    employees: employees.SQL;
    users: users.SQL;
  }[T];

}
