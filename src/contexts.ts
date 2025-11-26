import { createContext } from "react";

import type { IGameTheme, GameTheme, IScoreCtx, WindowSizeType, INowTheory } from "./types";

type ThemeContextType = IGameTheme & {
    change(value: GameTheme): void;
}

export const ThemeContext = createContext<ThemeContextType>({
    value: "dark",
    prevValue: null,
    change: (value: GameTheme) => value
});

export const ScoreContext = createContext<IScoreCtx>({} as IScoreCtx);

export const WindowSizeContext = createContext<WindowSizeType>("mobile_tiny");

export const NowTheory = createContext<INowTheory>({} as INowTheory);