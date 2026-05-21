"use server";

import { revalidatePath } from "next/cache";
import { signOut } from "../lib/session";

/**
 * Clear the end-user session cookie. Used by the "Sign out" form on the
 * home page (and anywhere else a logged-in user wants to step back to
 * anonymous).
 *
 * No DB write — the cookie is the only authoritative session state.
 * If the user wants to come back in, they paste their recovery code
 * at /return.
 *
 * Return type is Promise<void> so it can bind directly to a
 * <form action={signOutUser}>.
 */
export async function signOutUser(): Promise<void> {
  await signOut();
  revalidatePath("/");
}
