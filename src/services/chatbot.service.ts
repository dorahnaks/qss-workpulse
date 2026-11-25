import { ApiError, apiRequest, isLiveApiConfigured } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/translations";
import { getDashboardOverview } from "@/services/dashboard.service";
import { getNotifications } from "@/services/notifications.service";
import { getClientTaskRequests } from "@/services/task-requests.service";

export interface ChatActionLink {
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  action?: ChatActionLink;
}

interface AssistantReply {
  reply: string;
  action?: ChatActionLink;
}

function formatNum(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export async function sendAssistantMessage(
  prompt: string,
  locale: Locale
): Promise<AssistantReply> {
  if (isLiveApiConfigured()) {
    try {
      return await apiRequest<AssistantReply>("/client/assistant/chat", {
        method: "POST",
        body: { message: prompt, locale },
      });
    } catch (error) {
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof ApiError && error.status === 0);
      if (!isNetworkError) throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 350));

  const [summary, notifications, taskRequests] = await Promise.all([
    getDashboardOverview("today"),
    getNotifications(),
    getClientTaskRequests(),
  ]);

  const q = prompt.toLowerCase();
  const unread = notifications.filter((n) => !n.read);
  const pendingAdminTasks = taskRequests.filter(
    (task) => task.status === "Pending Admin Review"
  );

  // 0. Client task requests / admin assignment
  if (/task|request|assign|work order|kazi|tâche|igikorwa/.test(q)) {
    const latestTask = pendingAdminTasks[0] ?? taskRequests[0];
    return {
      reply:
        pendingAdminTasks.length > 0
          ? `You have ${pendingAdminTasks.length} task request(s) pending Q-Sourcing Admin team assignment (latest: "${latestTask.title}" — ${latestTask.referenceCode}, est. ${latestTask.estimatedWorkers} workers). You can add more tasks anytime from the Dashboard.`
          : `You have ${taskRequests.length} submitted task request(s), all currently assigned. Click "Request Task" on the Dashboard to submit a new work order for Admin assignment.`,
      action: { label: "Manage Task Requests", href: "/dashboard" },
    };
  }
  const attentionTeams = summary.teams.filter(
    (team) => team.status === "Needs Attention"
  );
  const topTeam = [...summary.teams].sort(
    (a, b) => b.actualUnits / b.targetUnits - a.actualUnits / a.targetUnits
  )[0];

  // 1. Workers / headcount / attendance
  if (
    /worker|staff|headcount|deploy|attend|mfanyakazi|wafanyakazi|agent|abakozi/.test(
      q
    )
  ) {
    const pct = Math.round(
      (summary.deployedWorkers / Math.max(summary.scheduledWorkers, 1)) * 100
    );
    if (locale === "sw") {
      return {
        reply: `Kwa sasa kuna wafanyakazi ${summary.deployedWorkers} kati ya ${summary.scheduledWorkers} kazini (${pct}% mahudhurio) katika timu ${summary.activeTeamsCount} na zamu ${summary.activeShiftsCount}.`,
        action: { label: "Fungua Dashibodi", href: "/dashboard" },
      };
    }
    if (locale === "fr") {
      return {
        reply: `${summary.deployedWorkers} agents sur ${summary.scheduledWorkers} sont actuellement déployés (${pct}% de présence) sur ${summary.activeTeamsCount} équipes actives et ${summary.activeShiftsCount} postes.`,
        action: { label: "Ouvrir le tableau de bord", href: "/dashboard" },
      };
    }
    if (locale === "rw") {
      return {
        reply: `Ubu hari abakozi ${summary.deployedWorkers} kuri ${summary.scheduledWorkers} bari mu kazi (${pct}% ubwitabire) mu matsinda ${summary.activeTeamsCount}.`,
        action: { label: "Fungura Incamake", href: "/dashboard" },
      };
    }
    return {
      reply: `There are currently ${summary.deployedWorkers} of ${summary.scheduledWorkers} scheduled workers deployed (${pct}% attendance) across ${summary.activeTeamsCount} active teams and ${summary.activeShiftsCount} shifts.`,
      action: { label: "View Dashboard", href: "/dashboard" },
    };
  }

  // 2. Teams needing attention / behind target
  if (
    /attention|behind|lag|issue|problem|umakini|kwitabwaho|retard|team|timu|équipe|itsinda/.test(
      q
    )
  ) {
    const teamText =
      attentionTeams.length > 0
        ? attentionTeams
            .map(
              (team) =>
                `${team.name} (${formatNum(team.actualUnits)} / ${formatNum(
                  team.targetUnits
                )} units, ${formatNum(team.pendingUnits)} pending, Sup: ${
                  team.supervisor
                })`
            )
            .join("; ")
        : "All teams are currently on track or exceeding target.";

    if (locale === "sw") {
      return {
        reply: `Timu zinazohitaji umakini leo: ${teamText}. Timu inayoongoza ni ${topTeam.name}.`,
        action: { label: "Tazama Dashibodi", href: "/dashboard" },
      };
    }
    if (locale === "fr") {
      return {
        reply: `Équipes nécessitant une attention aujourd'hui : ${teamText}. L'équipe en tête est ${topTeam.name}.`,
        action: { label: "Voir le tableau de bord", href: "/dashboard" },
      };
    }
    if (locale === "rw") {
      return {
        reply: `Amatsinda akeneye kwitabwaho uyu munsi: ${teamText}. Itsinda riri imbere ni ${topTeam.name}.`,
        action: { label: "Reba Incamake", href: "/dashboard" },
      };
    }
    return {
      reply: `Teams needing attention today: ${teamText}. Top performing team: ${topTeam.name} (${formatNum(
        topTeam.actualUnits
      )} / ${formatNum(topTeam.targetUnits)} units).`,
      action: { label: "Inspect Active Teams", href: "/dashboard" },
    };
  }

  // 3. Notifications / alerts / shifts
  if (/notif|alert|unread|shift|arifa|zamu|alerte|poste|ubutumwa/.test(q)) {
    const latest = unread[0] ?? notifications[0];
    if (locale === "sw") {
      return {
        reply: `Una arifa ${unread.length} ambazo hazijasomwa. Ya hivi karibuni: "${latest?.title ?? "Hakuna"}" — ${latest?.message ?? ""}`,
        action: { label: "Fungua Arifa", href: "/notifications" },
      };
    }
    if (locale === "fr") {
      return {
        reply: `Vous avez ${unread.length} notification(s) non lue(s). Dernière alerte : « ${latest?.title ?? "Aucune"} » — ${latest?.message ?? ""}`,
        action: { label: "Ouvrir les notifications", href: "/notifications" },
      };
    }
    if (locale === "rw") {
      return {
        reply: `Ufite ubutumwa ${unread.length} butarasomwa. Ubwa vuba: "${latest?.title ?? "Nta na bumwe"}" — ${latest?.message ?? ""}`,
        action: { label: "Fungura Ubutumwa", href: "/notifications" },
      };
    }
    return {
      reply: `You have ${unread.length} unread alert(s). Latest: "${latest?.title ?? "None"}" — ${latest?.message ?? ""}`,
      action: { label: "Open Notifications", href: "/notifications" },
    };
  }

  // 4. Settings / password / company / profile
  if (
    /setting|profile|password|company|account|wasifu|nenosiri|paramètre|mot de passe|umwirondoro/.test(
      q
    )
  ) {
    if (locale === "sw") {
      return {
        reply:
          "Unaweza kusasisha wasifu wako, maelezo ya kampuni, nenosiri, na mipangilio ya arifa kwenye ukurasa wa Wasifu na Mipangilio.",
        action: { label: "Fungua Mipangilio", href: "/settings" },
      };
    }
    if (locale === "fr") {
      return {
        reply:
          "Vous pouvez modifier votre profil, les informations de l'entreprise, votre mot de passe et vos alertes dans Profil et paramètres.",
        action: { label: "Ouvrir les paramètres", href: "/settings" },
      };
    }
    if (locale === "rw") {
      return {
        reply:
          "Ushobora guhindura umwirondoro wawe, amakuru y'ikigo, ijambo ry'ibanga, n'ubutumwa mu gice cy'Igenamiterere.",
        action: { label: "Fungura Igenamiterere", href: "/settings" },
      };
    }
    return {
      reply:
        "You can update your account profile, company site details, password, and notification preferences anytime in Profile & Settings.",
      action: { label: "Go to Profile & Settings", href: "/settings" },
    };
  }

  // 5. Default: Today's production summary
  if (locale === "sw") {
    return {
      reply: `Muhtasari wa leo: Matokeo halisi ni ${formatNum(
        summary.actualOutput
      )} kati ya lengo la ${formatNum(
        summary.productionTarget
      )} (${summary.achievementRate.toFixed(1)}%), huku ${formatNum(
        summary.pendingOutput
      )} zikiwa bado. Wafanyakazi ${summary.deployedWorkers}/${
        summary.scheduledWorkers
      } wako kazini.`,
      action: { label: "Fungua Dashibodi", href: "/dashboard" },
    };
  }
  if (locale === "fr") {
    return {
      reply: `Résumé du jour : ${formatNum(
        summary.actualOutput
      )} unités produites sur un objectif de ${formatNum(
        summary.productionTarget
      )} (${summary.achievementRate.toFixed(1)}%), avec ${formatNum(
        summary.pendingOutput
      )} en attente. ${summary.deployedWorkers}/${
        summary.scheduledWorkers
      } agents déployés.`,
      action: { label: "Ouvrir le tableau de bord", href: "/dashboard" },
    };
  }
  if (locale === "rw") {
    return {
      reply: `Incamake y'uyu munsi: Umusaruro wabonetse ni ${formatNum(
        summary.actualOutput
      )} ku ntego ya ${formatNum(
        summary.productionTarget
      )} (${summary.achievementRate.toFixed(1)}%), hasigaye ${formatNum(
        summary.pendingOutput
      )}. Abakozi ${summary.deployedWorkers}/${
        summary.scheduledWorkers
      } bari ku kazi.`,
      action: { label: "Fungura Incamake", href: "/dashboard" },
    };
  }
  return {
    reply: `Today's production summary: ${formatNum(
      summary.actualOutput
    )} actual units against a target of ${formatNum(
      summary.productionTarget
    )} (${summary.achievementRate.toFixed(1)}% achievement), with ${formatNum(
      summary.pendingOutput
    )} units pending across ${summary.activeTeamsCount} active teams.`,
    action: { label: "View Full Dashboard", href: "/dashboard" },
  };
}
