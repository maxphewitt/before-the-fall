import Link from "next/link";
import { redirect } from "next/navigation";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import { listUserHabits } from "../../../actions/habits";
import { listHabitSchedules } from "../../../actions/habitSchedules";
import { HABITS, type HabitSlug } from "../../../lib/habits";
import HabitScheduler, { type SchedulerItem } from "./HabitScheduler";

/**
 * /today/schedule — attach a time of day to habits (task-41).
 *
 * Lists the user's habits, each with a time picker. Setting a time makes it
 * show on the Home "Daily habits" rail and (later) drives gentle reminders.
 * Purely a when-to-do-it layer — it does not affect streak/journey math.
 */
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const [habitsRes, schedulesRes] = await Promise.all([
    listUserHabits(),
    listHabitSchedules(),
  ]);

  const habits = habitsRes.success ? habitsRes.data : [];
  const scheduleMap = new Map(
    (schedulesRes.success ? schedulesRes.data : []).map((s) => [s.habitSlug, s.scheduledTime])
  );

  const items: SchedulerItem[] = habits
    .filter((h) => HABITS[h.habitSlug as HabitSlug])
    .map((h) => ({
      slug: h.habitSlug as HabitSlug,
      label: HABITS[h.habitSlug as HabitSlug].label,
      description: HABITS[h.habitSlug as HabitSlug].description,
      time: scheduleMap.get(h.habitSlug as HabitSlug) ?? null,
    }));

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-6 pb-4 px-0.5">
        <BackLink fallbackHref="/home" label="Home" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-2" />
        <h1 className="font-serif text-[26px] font-medium leading-tight mt-4">Set your times</h1>
        <p className="text-sm text-white/70 font-light leading-relaxed mt-1.5">
          Give a habit a time of day and it shows up in your day. Leave it blank
          to keep it without a set time. You can change these whenever.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-[18px] bg-white/[0.055] border border-white/[0.09] p-6 text-center">
          <p className="text-white/70 font-light leading-relaxed mb-4">
            You don&rsquo;t have any habits yet.
          </p>
          <Link href="/today/edit" className="inline-flex rounded-[14px] py-3 px-6 font-bold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold">
            Choose habits
          </Link>
        </div>
      ) : (
        <HabitScheduler items={items} />
      )}
    </main>
  );
}
