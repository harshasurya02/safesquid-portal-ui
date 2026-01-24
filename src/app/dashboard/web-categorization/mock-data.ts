export interface Category {
  id: string;
  name: string;
  description: string;
  websites: string[];
}

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Cyber Slacking",
    description:
      "Category for having all the websites that can initiate cyber slacking. Including social media, entertainment, and gaming sites that employees might use during work hours.",
    websites: [
      "www.facebook.com",
      "www.youtube.com",
      "www.twitter.com",
      "www.instagram.com",
      "www.reddit.com",
    ],
  },
  {
    id: "2",
    name: "Gaming",
    description:
      "Websites related to online and offline gaming, including game news, reviews, and platforms. Helpful for restricting gaming during productive hours.",
    websites: [
      "www.steam.com",
      "www.epicgames.com",
      "www.twitch.tv",
      "www.ign.com",
    ],
  },
  {
    id: "3",
    name: "Social Media",
    description:
      "All major social networking platforms where users can connect, share content, and communicate. Typically used to limit distractions.",
    websites: [
      "www.facebook.com",
      "www.twitter.com",
      "www.linkedin.com",
      "www.instagram.com",
    ],
  },
  {
    id: "4",
    name: "News",
    description:
      "General news and information websites, including global news, local news, and specialized news outlets.",
    websites: [
      "www.cnn.com",
      "www.bbc.com",
      "www.nytimes.com",
      "www.reuters.com",
    ],
  },
  {
    id: "5",
    name: "Entertainment",
    description:
      "Websites focused on movies, music, TV shows, and general entertainment content.",
    websites: [
      "www.netflix.com",
      "www.hulu.com",
      "www.spotify.com",
      "www.disneyplus.com",
    ],
  },
  {
    id: "6",
    name: "Productivity",
    description:
      "Tools and websites designed to enhance work efficiency and collaboration.",
    websites: [
      "www.notion.so",
      "www.slack.com",
      "www.trello.com",
      "www.asana.com",
    ],
  },
  {
    id: "7",
    name: "Shopping",
    description:
      "E-commerce and online shopping platforms where users can browse and purchase products.",
    websites: [
      "www.amazon.com",
      "www.ebay.com",
      "www.walmart.com",
      "www.target.com",
    ],
  },
];
