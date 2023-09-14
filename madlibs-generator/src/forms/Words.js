import React, { useState } from "react";
import classes from './Words.module.css';

function MadlibStory({ story, userWords }) {
    const regex = /[\s.]+/;
    const words = story.split(regex)
    console.log(words);
    console.log(Object.values(userWords));
    return (
        <p>
            {words.map((word, idx) => 
                Object.values(userWords).includes(word) 
                ? <span key={idx} className={classes.highlighted}>{` ${word} `}</span>
                : " " + word + " " 
            ) }
        </p>
    );
}

const Words = ({ types }) => {
  const [words, setWords] = useState({});
  const [story, setStory] = useState(''); // State to hold the generated story
  const [resObj, setResObj] = useState({story: "", userWords:""});
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/madlib-story", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(words)
      });
      
      // You may want to do something with the response
      const data = await response.json();

            if(data.story) {
                setStory(data.story);
                setResObj({
                    story: data.story,
                    userWords: words
                })
                 // Update the story state with the generated story
            } else {
                console.error("Failed to generate story:", data.error);
            }

    } catch (error) {
      console.error("Failed to fetch madlib types:", error);
    }
  };

  return (
    <>
    <form className={classes.form} onSubmit={handleSubmit}>
      {types.map((type, i) => (
        <div key={i} className={classes['input-group']}>
          <label className={classes.label} htmlFor={`input${i}`}>{type}</label>
          <input className={classes.input}
            id={`input${i}`}
            onChange={(e) => {
              const value = e.target.value;
              setWords((prev) => {
                const newState = { ...prev };
                newState[type] = value;
                return newState;
              });
            }}
          />
        </div>
      ))}
      <button className={classes.button} type="submit">Generate my Madlibs</button>
    </form>
    {story && <div className={classes.story}><h3>Generated Story:</h3>{MadlibStory(resObj)}</div>} {/* Display the story if it exists */}
    </>
  );
};

export default Words;
