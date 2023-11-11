import { getSrvExamples } from '@/examples';
import React from 'react';
import App from './[...pathname]';

export default function Home({ examples }: any) {
  return <App examples={examples} />;
}

export async function getStaticProps() {
  const examples = await getSrvExamples();
  return {
    props: {
      examples: examples,
    },
  };
} 