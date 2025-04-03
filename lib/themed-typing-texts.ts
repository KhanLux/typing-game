// Themed texts for typing practice
interface ThemedText {
  text: string;
  theme: string;
}

export const themedTypingTexts: ThemedText[] = [
  // Quotes
  {
    theme: "quotes",
    text: "The sciences, each straining in its own direction, have hitherto harmed us little; but some day the piecing together of dissociated knowledge will open up such terrifying vistas of reality, and of our frightful position therein, that we shall either go mad from the revelation or flee from the deadly light into the peace and safety of a new dark age."
  },
  {
    theme: "quotes",
    text: "In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move. The ships hung in the sky in much the same way that bricks don't."
  },
  {
    theme: "quotes",
    text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood."
  },
  {
    theme: "quotes",
    text: "The best way to predict the future is to invent it. Computer science is no more about computers than astronomy is about telescopes. We build our computer systems the way we build our cities: over time, without a plan, on top of ruins."
  },
  
  // Code Snippets
  {
    theme: "code",
    text: "function calculateFactorial(n) { if (n === 0 || n === 1) { return 1; } return n * calculateFactorial(n - 1); } // This recursive function calculates the factorial of a number"
  },
  {
    theme: "code",
    text: "const fetchData = async () => { try { const response = await fetch('https://api.example.com/data'); const data = await response.json(); return data; } catch (error) { console.error('Error fetching data:', error); } };"
  },
  {
    theme: "code",
    text: "class Rectangle { constructor(height, width) { this.height = height; this.width = width; } get area() { return this.calcArea(); } calcArea() { return this.height * this.width; } }"
  },
  {
    theme: "code",
    text: "import React, { useState, useEffect } from 'react'; function Counter() { const [count, setCount] = useState(0); useEffect(() => { document.title = `You clicked ${count} times`; }); return ( <div><p>You clicked {count} times</p><button onClick={() => setCount(count + 1)}>Click me</button></div> ); }"
  },
  
  // Prose
  {
    theme: "prose",
    text: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Typing practice helps improve speed and accuracy over time."
  },
  {
    theme: "prose",
    text: "Typing is a fundamental skill in today's digital world. Regular practice can significantly improve your typing speed and accuracy, making you more productive in various tasks that involve using a keyboard."
  },
  {
    theme: "prose",
    text: "The art of programming involves creating efficient, readable, and maintainable code. Good programmers write code that humans can understand, not just computers. Clean code is simple and direct, reading like well-written prose."
  },
  {
    theme: "prose",
    text: "Artificial intelligence is transforming how we interact with technology. Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions, enabling computers to perform tasks that typically require human intelligence."
  },
  
  // Poetry
  {
    theme: "poetry",
    text: "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth;"
  },
  {
    theme: "poetry",
    text: "I wandered lonely as a cloud That floats on high o'er vales and hills, When all at once I saw a crowd, A host, of golden daffodils; Beside the lake, beneath the trees, Fluttering and dancing in the breeze."
  },
  {
    theme: "poetry",
    text: "Because I could not stop for Death – He kindly stopped for me – The Carriage held but just Ourselves – And Immortality. We slowly drove – He knew no haste And I had put away My labor and my leisure too, For His Civility –"
  },
  {
    theme: "poetry",
    text: "Hope is the thing with feathers That perches in the soul, And sings the tune without the words, And never stops at all, And sweetest in the gale is heard; And sore must be the storm That could abash the little bird That kept so many warm."
  }
];

// Fallback to get all texts regardless of theme
export const getAllTexts = (): string[] => {
  return themedTypingTexts.map(item => item.text);
};

// Get texts filtered by theme
export const getTextsByTheme = (theme: string): string[] => {
  return themedTypingTexts
    .filter(item => item.theme === theme)
    .map(item => item.text);
};
