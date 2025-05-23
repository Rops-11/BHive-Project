import type { Preview } from '@storybook/react'
import "@/app/globals.css"
import 'dotenv/config';
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;