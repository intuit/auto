import React from "react";

/** A button that routes the user to the getting started page */
export const GetStarted = () => (
  <a
    href="https://intuit.github.io/auto/docs/welcome/getting-started"
    className="uppercase text-xl lg:text-2xl border-2 border-white rounded px-6 py-3 hover:bg-primary-500 hover:text-white"
  >
    <span className="pr-2">Get Started</span> 🎉
  </a>
);
