import * as Core from '@vercel/commerce/types/customer'

export type Maybe<T> = T | null

export * from '@vercel/commerce/types/customer'

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  AnyScalar: any
  DateTime: any
  Object: any
}

export type Customer = {
  id: Scalars['Int']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type CustomerSchema = Core.CustomerSchema
