export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    views: {
      value: 3456,
      growthRate: 0.43,
    },
    profit: {
      value: 4220,
      growthRate: 4.35,
    },
    products: {
      value: 3456,
      growthRate: 2.59,
    },
    ingresos: {
      value: 3456,
      growthRate: -0.95,
    },
  };
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}

export async function getIncomeHistory() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    series: [
      {
        name: "Ingresos",
        data: [12000, 15000, 11000, 18000, 22000, 30000, 28000, 35000, 32000, 40000, 45000, 50000],
      },
    ],
    categories: [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ],
  };
}

export async function getSalesByType() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    series: [45, 30, 25], // Porcentajes o cantidades
    labels: ["Paquetes", "Tours", "Independientes"],
  };
}

export async function getTopStats() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    places: [
      { name: "Machu Picchu", visits: 1250 },
      { name: "Cusco Ciudad", visits: 980 },
      { name: "Valle Sagrado", visits: 850 },
    ],
    packages: [
      { name: "Cusco Mágico 5D/4N", sales: 120 },
      { name: "Aventura Inca 4D/3N", sales: 95 },
      { name: "Luna de Miel Andina", sales: 80 },
    ],
    tours: [
      { name: "Montaña de 7 Colores", bookings: 450 },
      { name: "Laguna Humantay", bookings: 380 },
      { name: "City Tour Cusco", bookings: 320 },
    ]
  }
}

export async function getBookingStatus() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    series: [
      {
        name: "Reservas",
        data: [150, 25, 45] // Confirmadas, Canceladas, Pendientes
      }
    ],
    categories: ["Confirmadas", "Canceladas", "Pendientes"],
    colors: ["#10B981", "#EF4444", "#F59E0B"]
  }
}

export async function getRecentBookings() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "#R-8547", client: "Maria Gonzalez", package: "Cusco Mágico", date: "02 Ene, 2026", status: "Confirmado", amount: "$1,200" },
    { id: "#R-8548", client: "John Doe", package: "Lineas de Nazca", date: "01 Ene, 2026", status: "Pendiente", amount: "$450" },
    { id: "#R-8549", client: "Ana Silva", package: "Aventura Inca", date: "31 Dic, 2025", status: "Cancelado", amount: "$890" },
    { id: "#R-8550", client: "Carlos Perez", package: "Full Day Ica", date: "31 Dic, 2025", status: "Confirmado", amount: "$150" },
    { id: "#R-8551", client: "Elena Rojas", package: "City Tour", date: "30 Dic, 2025", status: "Confirmado", amount: "$45" },
  ]
}

export async function getNewUsersHistory() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    series: [{
      name: "Nuevos Usuarios",
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
    }],
    categories: [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ]
  }
}