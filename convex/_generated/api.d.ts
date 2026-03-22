/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as blogPosts from "../blogPosts.js";
import type * as capsules from "../capsules.js";
import type * as events from "../events.js";
import type * as forum from "../forum.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as members from "../members.js";
import type * as missions from "../missions.js";
import type * as notifications from "../notifications.js";
import type * as posts from "../posts.js";
import type * as profiles from "../profiles.js";
import type * as recommended from "../recommended.js";
import type * as tools from "../tools.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  blogPosts: typeof blogPosts;
  capsules: typeof capsules;
  events: typeof events;
  forum: typeof forum;
  http: typeof http;
  lib: typeof lib;
  members: typeof members;
  missions: typeof missions;
  notifications: typeof notifications;
  posts: typeof posts;
  profiles: typeof profiles;
  recommended: typeof recommended;
  tools: typeof tools;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
