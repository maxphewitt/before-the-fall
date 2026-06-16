"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signOut } from "../lib/session";

/**
 * Clear the end-user session cookie. Used by the "Sign out" form in the
 * platform shell (and anywhere else a logged-in user wants to step back
 * to anonymous).
 *
 * No DB write — the cookie is the only authoritative session state.
 * If the user wants to come back in, they paste their recovery code
 * at /return.
 *
 * After clearing, send the user to the public home. The `?stay=1` keeps
 * middleware from treating a not-yet-cleared cookie as a logged-in
 * session and bouncing them straight back into the platform.
 *
 * Return type is Promise<void> so it can bind directly to a
 * <form action={signOutUser}>.
 */
export async function signOutUser(): Promise<void> {
  await signOut();
  revalidatePath("/", "layout");
  redirect("/?stay=1");
}
