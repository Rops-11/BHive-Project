import type { Preview } from "@storybook/react";
import "./test-setup";

import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
