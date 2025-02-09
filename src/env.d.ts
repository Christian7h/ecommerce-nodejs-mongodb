type NetlifyLocals = import('@astrojs/netlify').NetlifyLocals;

/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
	}
  interface Locals extends NetlifyLocals {
    geo: {
      city?: string;
      country?: {
        code?: string;
        name?: string;
      };
      postalCode?: string;
      subdivision?: {
        code?: string;
        name?: string;
      };
      latitude?: number;
      longitude?: number;
      timezone?: string;
    };
    ip: string;
    requestId: string;
    cookies: Record<string, string>;
    deploy: {
      context: string;
      id: string;
      published: boolean;
    };
  }
}


