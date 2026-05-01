export const navigationData = [
  // 1. ALL TIME GREATS — Type C: Player Grid
  {
    label: "All Time Greats",
    slug: "all-time-greats",
    layout: "players",
    players: [
      { name: "Tom Brady", sport: "NFL", path: "All Time Greats > Tom Brady (NFL)" },
      { name: "Michael Jordan", sport: "NBA", path: "All Time Greats > Michael Jordan (NBA)" },
      { name: "Kobe Bryant", sport: "NBA", path: "All Time Greats > Kobe Bryant (NBA)" },
      { name: "LeBron James", sport: "NBA", path: "All Time Greats > Lebron James (NBA)" },
      { name: "Babe Ruth", sport: "MLB", path: "All Time Greats > Babe Ruth (MLB)" },
      { name: "Wayne Gretzky", sport: "NHL", path: "All Time Greats > Wayne Gretzsky (NHL)" },
      { name: "Joe Montana", sport: "NFL", path: "All Time Greats > Joe Montana (NFL)" },
      { name: "Magic Johnson", sport: "NBA", path: "All Time Greats > Magic Johnson (NBA)" },
      { name: "Derek Jeter", sport: "MLB", path: "All Time Greats > Derek Jeter (MLB)" },
      { name: "Sidney Crosby", sport: "NHL", path: "All Time Greats > Sidney Crosby (NHL)" },
      { name: "Jerry Rice", sport: "NFL", path: "All Time Greats > Jerry Rice (NFL)" },
      { name: "Larry Bird", sport: "NBA", path: "All Time Greats > Larry Bird (NBA)" },
      { name: "Mickey Mantle", sport: "MLB", path: "All Time Greats > Mickey Mantle (MLB)" },
      { name: "Mario Lemieux", sport: "NHL", path: "All Time Greats > Mario Lemieux (NHL)" },
      { name: "Peyton Manning", sport: "NFL", path: "All Time Greats > Peyton Manning (NFL)" },
      { name: "Steph Curry", sport: "NBA", path: "All Time Greats > Steph Curry (NBA)" },
      { name: "Hank Aaron", sport: "MLB", path: "All Time Greats > Hank Aaron (MLB)" },
      { name: "Gordie Howe", sport: "NHL", path: "All Time Greats > Gordie Howe (NHL)" },
      { name: "Patrick Mahomes", sport: "NFL", path: "All Time Greats > Patrick Mahomes (NFL)" },
      { name: "Kareem Abdul-Jabbar", sport: "NBA", path: "All Time Greats > Kareem Abdul-Jabbar (NBA)" },
    ]
  },

  // 2. CHAMPIONS BY YEAR — direct page link
  {
    label: "Champions by Year",
    slug: "champions-by-year",
    layout: "direct",
    path: "/champions-by-year"
  },

  // 3. CHAMPIONSHIP SERIES — Type A: 4 large clickable cards
  {
    label: "Championship Series",
    slug: "championship-series",
    layout: "championship-cards",
    cards: [
      { label: "Super Bowl", sport: "NFL", icon: "🏈", path: "Championships/Finals > Super Bowl Championship Rings", description: "NFL Championship Rings" },
      { label: "NBA Finals", sport: "NBA", icon: "🏀", path: "Championships/Finals > NBA Finals Championship Rings", description: "NBA Championship Rings" },
      { label: "World Series", sport: "MLB", icon: "⚾", path: "Championships/Finals > World Series Championship Rings", description: "MLB Championship Rings" },
      { label: "Stanley Cup", sport: "NHL", icon: "🏒", path: "Championships/Finals > Stanley Cup Championship Rings", description: "NHL Championship Rings" }
    ]
  },

  // 4. COMPLETE TEAM SETS — columnar
  {
    label: "Complete Team Sets",
    slug: "complete-team-sets",
    layout: "columnar",
    children: [
      {
        label: "By City",
        children: [
          { label: "New York Teams", path: "Your City > New York City Pro Teams" },
          { label: "Los Angeles Teams", path: "Your City > Los Angeles Pro Teams" },
          { label: "Chicago Teams", path: "Your City > Chicago Pro Teams" },
          { label: "Boston Teams", path: "Your City > Boston Pro Teams" },
          { label: "Dallas Teams", path: "Your City > Dallas Pro Teams" },
          { label: "Toronto Teams", path: "Your City > Toronto Pro Teams" },
          { label: "Pittsburgh Teams", path: "Your City > Pittsburgh Pro Teams" },
          { label: "Miami Teams", path: "Your City > Miami Pro Teams" }
        ]
      },
      {
        label: "NFL Team Sets",
        children: [
          { label: "Green Bay Packers", path: "Teams > Green Bay Packers (NFL)" },
          { label: "New England Patriots", path: "Teams > New England Patriots (NFL)" },
          { label: "Dallas Cowboys", path: "Teams > Dallas Cowboys (NFL)" },
          { label: "Kansas City Chiefs", path: "Teams > Kansas City Chiefs (NFL)" },
          { label: "Pittsburgh Steelers", path: "Teams > Pittsburgh Steelers (NFL)" },
          { label: "San Francisco 49ers", path: "Teams > San Francisco 49ers (NFL)" }
        ]
      },
      {
        label: "NBA Team Sets",
        children: [
          { label: "Chicago Bulls", path: "Teams > Chicago Bulls (NBA)" },
          { label: "LA Lakers", path: "Teams > Los Angeles Lakers (NBA)" },
          { label: "Boston Celtics", path: "Teams > Boston Celtics (NBA)" },
          { label: "Golden State Warriors", path: "Teams > Golden State Warriors (NBA)" },
          { label: "San Antonio Spurs", path: "Teams > San Antonio Spurs (NBA)" }
        ]
      },
      {
        label: "MLB & NHL Sets",
        children: [
          { label: "New York Yankees", path: "Teams > New York Yankees (MLB)" },
          { label: "Chicago Cubs", path: "Teams > Chicago Cubs (MLB)" },
          { label: "LA Dodgers", path: "Teams > Los Angeles Dodgers (MLB)" },
          { label: "Montreal Canadiens", path: "Teams > Montreal Canadiens (NHL)" },
          { label: "Pittsburgh Penguins", path: "Teams > Pittsburgh Penguins (NHL)" },
          { label: "Chicago Blackhawks", path: "Teams > Chicago Blackhawks (NHL)" }
        ]
      }
    ]
  },

  // 5. LEAGUE — Type A: Icon Grid with 4 leagues + divisions
  {
    label: "League",
    slug: "league",
    layout: "league-grid",
    leagues: [
      {
        label: "NFL",
        icon: "🏈",
        divisions: [
          { label: "AFC East", path: "League > NFL - National Football League > AFC East" },
          { label: "AFC North", path: "League > NFL - National Football League > AFC North" },
          { label: "AFC South", path: "League > NFL - National Football League > AFC South" },
          { label: "AFC West", path: "League > NFL - National Football League > AFC West" },
          { label: "NFC East", path: "League > NFL - National Football League > NFC East" },
          { label: "NFC North", path: "League > NFL - National Football League > NFC North" },
          { label: "NFC South", path: "League > NFL - National Football League > NFC South" },
          { label: "NFC West", path: "League > NFL - National Football League > NFC West" }
        ]
      },
      {
        label: "NBA",
        icon: "🏀",
        divisions: [
          { label: "Atlantic", path: "League > NBA - National Basketball Association > EC Atlantic" },
          { label: "Central", path: "League > NBA - National Basketball Association > EC Central" },
          { label: "Southeast", path: "League > NBA - National Basketball Association > EC Southeast" },
          { label: "Northwest", path: "League > NBA - National Basketball Association > WC Northwest" },
          { label: "Pacific", path: "League > NBA - National Basketball Association > WC Pacific" },
          { label: "Southwest", path: "League > NBA - National Basketball Association > WC Southwest" }
        ]
      },
      {
        label: "MLB",
        icon: "⚾",
        divisions: [
          { label: "AL East", path: "League > MLB - Major League Baseball > AL East" },
          { label: "AL Central", path: "League > MLB - Major League Baseball > AL Central" },
          { label: "AL West", path: "League > MLB - Major League Baseball > AL West" },
          { label: "NL East", path: "League > MLB - Major League Baseball > NL East" },
          { label: "NL Central", path: "League > MLB - Major League Baseball > NL Central" },
          { label: "NL West", path: "League > MLB - Major League Baseball > NL West" }
        ]
      },
      {
        label: "NHL",
        icon: "🏒",
        divisions: [
          { label: "Atlantic", path: "League > NHL - National Hockey League > EC Atlantic" },
          { label: "Metropolitan", path: "League > NHL - National Hockey League > EC Metropolitan" },
          { label: "Central", path: "League > NHL - National Hockey League > WC Central" },
          { label: "Pacific", path: "League > NHL - National Hockey League > WC Pacific" }
        ]
      }
    ]
  },

  // 6. I WANT THEM ALL — direct page
  {
    label: "I Want Them All",
    slug: "i-want-them-all",
    layout: "direct",
    path: "/i-want-them-all"
  },

  // 7. SPECIAL RELEASE — Type B: Vertical Icon List
  {
    label: "Special Release",
    slug: "special-release",
    layout: "vertical-list",
    items: [
      { icon: "⭐", label: "Champion Player Rings", description: "Exclusive rings from champion players", path: "Special Release Champion Players Rings" },
      { icon: "🏈", label: "Super Bowl Limited", description: "Limited edition Super Bowl rings", path: "Championships/Finals > Super Bowl Championship Rings" },
      { icon: "🏀", label: "NBA Finals Limited", description: "Limited edition NBA Finals rings", path: "Championships/Finals > NBA Finals Championship Rings" },
      { icon: "⚾", label: "World Series Limited", description: "Limited edition World Series rings", path: "Championships/Finals > World Series Championship Rings" },
      { icon: "🏒", label: "Stanley Cup Limited", description: "Limited edition Stanley Cup rings", path: "Championships/Finals > Stanley Cup Championship Rings" },
      { icon: "🎁", label: "Your Year Gift Box", description: "Championship year gift sets", link: "/your-year-gift" }
    ]
  },

  // 8. TEAMS — direct page
  {
    label: "Teams",
    slug: "teams",
    layout: "direct",
    path: "/teams"
  },

  // 9. CITIES — direct page
  {
    label: "Cities",
    slug: "cities",
    layout: "direct",
    path: "/cities"
  },

  // 10. YOUR YEAR GIFT — direct page
  {
    label: "Your Year Gift",
    slug: "your-year-gift",
    layout: "direct",
    path: "/your-year-gift"
  },

  // 11. NEWS — Type B: Vertical Icon List
  {
    label: "News",
    slug: "news",
    layout: "vertical-list",
    items: [
      { icon: "📰", label: "Latest Articles", description: "News from the world of champions", link: "/blog" },
      { icon: "🏆", label: "Championship Updates", description: "Newest championship rings added", link: "/blog" },
      { icon: "⭐", label: "Player Spotlights", description: "Featured athlete collections", link: "/blog" }
    ]
  },

  // 12. CONTACT — Type B: Vertical Icon List
  {
    label: "Contact",
    slug: "contact",
    layout: "vertical-list",
    items: [
      { icon: "✉️", label: "Get In Touch", description: "Send us a message", link: "/contact" },
      { icon: "❓", label: "FAQs", description: "Find answers to common questions", link: "/faq" },
      { icon: "📦", label: "Shipping & Returns", description: "Policies and info", link: "/shipping-policy" },
      { icon: "📏", label: "Size Guide", description: "Find your perfect ring size", link: "/size-guide" }
    ]
  }
];