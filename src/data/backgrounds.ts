export interface Background {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
}

export const BACKGROUNDS: Background[] = [
    {
        id: "bg_grass",
        name: "Grass Field",
        url: "/backgrounds/bg_grass.png",
        width: 750,
        height: 612,
    },
    {
        id: "bg_room",
        name: "My Room",
        url: "/backgrounds/bg_room.png",
        width: 750,
        height: 606,
    },
];

export const DEFAULT_BACKGROUND_ID = "bg_room";
