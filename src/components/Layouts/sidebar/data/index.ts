import * as Icons from "../icons";

// Add filtering logic properties if needed, but for now just raw data.
export const NAV_DATA = [
  {
    label: "Menú Principal",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
        roles: ["admin", "client"], // Example idea, but I can't change type definition easily here without updating usages.
        // I will just add the items and handle filtering in the component by title or url.
      },
      {
        title: "Destinos",
        url: "/admin/destinos",
        icon: Icons.MapPin,
        items: [],
      },
      {
        title: "Tours",
        url: "/admin/tours",
        icon: Icons.Compass,
        items: [],
      },
      {
        title: "Paquetes",
        url: "/admin/paquetes",
        icon: Icons.Box,
        items: [],
      },
      {
        title: "Usuarios",
        url: "/admin/users",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Reservas",
        url: "/admin/reservas",
        icon: Icons.Calendar,
        items: [],
      },
    ],
  },
  {
    label: "Otros",
    items: [
      {
        title: "Perfil",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
