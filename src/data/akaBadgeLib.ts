import {
  getFirestore,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore/lite";
import { Badge, loadBadge } from "./badgeLib";
import { BadgeAward, loadBadgeAwardByBadge } from "./badgeAwardLib";

const db = getFirestore();

export type AkaBadge = {
  id: string;
  name: string;
  category: string;
  sort: number;
};

const emptyAkaBadge: AkaBadge = {
  id: "",
  name: "",
  category: "",
  sort: 0,
};

export const getEmptyAkaBadge = (): AkaBadge => {
  return { ...emptyAkaBadge };
};

// return id of aka badge
export const loadAkaBadge = async <Type>(
  name: string
): Promise<AkaBadge | undefined> => {
  const colRef = collection(db, "akabadges");

  const q = query(colRef, where("name", "==", name));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length <= 0) {
    return undefined;
  }

  let badge = getEmptyAkaBadge();
  const loadedBadge = querySnapshot.docs[0].data();
  badge.id = querySnapshot.docs[0].id;
  badge = { ...badge, ...loadedBadge };
  return badge;
};

// loads all aka badges for given uid
export const loadAkaBadgeAwards = async (
  category: string,
  publickey: string
): Promise<{ badge: Badge; badgeAward: BadgeAward }[]> => {
  // load all akabadges for category
  const colRef = collection(db, "akabadges");
  const q = query(colRef, where("category", "==", category), orderBy("sort"));
  const querySnapshot = await getDocs(q);

  const akaBadges: AkaBadge[] = [];
  querySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const akaBadge = {
      id: doc.id,
      name: data.name,
      category: data.category,
      sort: data.sort,
    };
    akaBadges.push(akaBadge);
  });

  // load all badges and award matching akabadges
  const badgePromises: Record<string, Promise<Badge | undefined>> = {};
  const awardPromises: Record<
    string,
    Promise<
      | {
          id: string;
          badgeAward: BadgeAward;
        }
      | undefined
    >
  > = {};
  for (let i = 0; i < akaBadges.length; i++) {
    const badgeId = akaBadges[i].id;
    badgePromises[badgeId] = loadBadge(badgeId);
    awardPromises[badgeId] = loadBadgeAwardByBadge(publickey, badgeId);
  }

  // Wait for all badge promises to resolve
  const badges = await Promise.all(Object.values(badgePromises));

  // Wait for all award promises to resolve
  const awards = await Promise.all(Object.values(awardPromises));

  // join results
  // Convert resolved arrays back to objects keyed by ID for easy lookup
  const badgeResults = Object.keys(badgePromises).reduce((acc, id, index) => {
    acc[id] = badges[index];
    return acc;
  }, {} as Record<string, Badge | undefined>);

  const awardResults = Object.keys(awardPromises).reduce((acc, id, index) => {
    acc[id] = awards[index]?.badgeAward;
    return acc;
  }, {} as Record<string, BadgeAward | undefined>);

  // Join results ensuring the order matches akaBadges
  const list: { badge: Badge; badgeAward: BadgeAward }[] = [];

  akaBadges.forEach((akaBadge) => {
    const badgeId = akaBadge.id;
    const badge = badgeResults[badgeId];
    const badgeAward = awardResults[badgeId];

    if (badge && badgeAward) {
      list.push({
        badge,
        badgeAward,
      });
    }
  });

  return list;
};
