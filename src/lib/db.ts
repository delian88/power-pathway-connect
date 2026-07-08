const singleUser = {
  id: "user-1",
  email: "admin@example.com",
  passwordHash: "$2a$10$yK/mB.Hq4/yBqX.6X5X.6e7.BqX.6X5X.6e7.BqX.6X5X.6e7.", // dummy
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const siteSettings = {
  id: 1,
  heroText: "Power Pathway Connect",
  heroSubText: "We connect hotels, destinations, and event suppliers with thousands of highly qualified meeting professionals.",
  logoUrl: null,
  contactEmail: "contact@example.com",
  contactPhone: null,
  address: null,
  eventFee: 0,
  updatedAt: new Date(),
};

let events: any[] = [];

export const db = {
  user: {
    findUnique: async () => singleUser,
    create: async () => singleUser,
  },
  siteSettings: {
    findUnique: async () => siteSettings,
    findFirst: async () => siteSettings,
  },
  event: {
    findMany: async () => events,
    findUnique: async ({ where }: any) => events.find((e) => e.id === where.id) || null,
    count: async () => events.length,
    create: async ({ data }: any) => {
      const newEvent = { id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date(), ...data };
      events.push(newEvent);
      return newEvent;
    },
    delete: async ({ where }: any) => {
      events = events.filter((e) => e.id !== where.id);
      return { id: where.id };
    }
  },
} as any;
