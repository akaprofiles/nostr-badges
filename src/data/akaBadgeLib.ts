import {
  getFirestore,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { BadgeAward } from "./badgeAwardLib";

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
  awardedTo: string
): Promise<Record<string, BadgeAward>> => {
  let colRef = collection(db, "akabadges");
  let q = query(colRef, where("category", "==", category));
  let querySnapshot = await getDocs(q);

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

  console.log(`akaBadges: ${JSON.stringify(akaBadges)}`);

  // load badge awards for uid matching doc.id (badge id)
  const badgeIds = akaBadges.map((value: AkaBadge) => {
    return value.id;
  });

  colRef = collection(db, "badgeawards");
  q = query(
    colRef,
    where("awardedTo", "==", awardedTo),
    where("badge", "in", badgeIds)
  );
  querySnapshot = await getDocs(q);

  const awards: Record<string, BadgeAward> = {};
  querySnapshot.docs.forEach((doc) => {
    awards[doc.id] = doc.data() as BadgeAward;
  });

  console.log(`badgeAwards: ${JSON.stringify(awards)}`);
  return awards;
};
