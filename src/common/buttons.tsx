import { Theme } from "../common/enums";
import { LightModeIcon, DarkModeIcon } from "../common/graphics";
import { useAppDispatch } from "../hooks/hooks";
import { setAppTheme } from "../store/slices/appSlice";

export function DarkModeButton() {
  const dispatch = useAppDispatch();

  const setDarkTheme = () => {
    localStorage.setItem("theme", Theme.LIGHT);
    document.documentElement.classList.remove(Theme.DARK);
    dispatch(setAppTheme(Theme.LIGHT));
  };

  return (
    <div
      className="fixed border-2 rounded-full border-outline-variant-dark top-4 right-4 p-2 hover:cursor-pointer z-10"
      onClick={() => setDarkTheme()}
    >
      {DarkModeIcon("fill-outline-variant-dark w-8 h-8")}
    </div>
  );
}

export function LightModeButton() {
  const dispatch = useAppDispatch();

  const setDarkTheme = () => {
    localStorage.setItem("theme", Theme.DARK);
    document.documentElement.classList.add(Theme.DARK);
    dispatch(setAppTheme(Theme.DARK));
  };

  return (
    <div
      className="fixed border-2 rounded-full border-outline-variant-light top-4 right-4 p-2 hover:cursor-pointer z-10"
      onClick={() => setDarkTheme()}
    >
      {LightModeIcon("fill-outline-variant-light w-8 h-8")}
    </div>
  );
}

export function PortfolioButton() {
  return (
    <a href="https://rohitrai.dev" target="_blank" rel="author">
      <button className="text-label-large bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full">
        Portfolio
      </button>
    </a>
  );
}
