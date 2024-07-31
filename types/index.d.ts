export { };

declare global {
    interface SessionData {
        rank: number | null;
        value: ThemeItem | null;
    }

    interface Theme {
        id: number;
        name: string;
        maxRanking: number;
        themeItems: ThemeItem[];
    }

    interface ThemeItem {
        id: number;
        themeId: number;
        name: string | undefined;
        image: string | undefined;
    }

    interface PendingCreated {
        themeId: number | undefined;
        tempId: number;
        name: string | undefined;
        image: string | undefined;
    }

    interface PendingUpdated {
        itemId: number;
        name: string | undefined;
        image: string | undefined;
    }

    interface ModifiedThemeData {
        created: PendingCreated[]
        updated: PendingUpdated[]
        deleted: number[]
    }
}