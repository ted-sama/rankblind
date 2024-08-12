export { };

declare global {
    interface SessionData {
        rank: number | null;
        value: ThemeItem | null;
    }

    interface Theme {
        id: number;
        name: string;
        description: string | null;
        image: string;
        maxRanking: number;
        themeItems: ThemeItem[];
    }

    interface ThemeItem {
        id: number;
        themeId: number;
        name: string | null;
        image: string | null;
    }

    interface PendingCreated {
        themeId: number;
        tempId: number;
        name: string;
        image: File | null;
    }

    interface PendingUpdated {
        itemId: number;
        name: string | null;
        image: File | null;
    }

    interface ModifiedThemeData {
        created: PendingCreated[]
        updated: PendingUpdated[]
        deleted: number[]
    }
}