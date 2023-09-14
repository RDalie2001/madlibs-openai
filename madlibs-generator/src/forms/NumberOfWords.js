import React, { useState } from "react";
import Words from "./Words";
import classes from './NumberOfWords.module.css';
const NumberOfWords = () => {
  const[types,setTypes] = useState(null);
  const [numWords, setNumWords] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/madlib-types?numWords=${numWords}`
      );
      setTypes(await response.json());
    } catch (error) {
      console.error("Failed to fetch madlib types:", error);
    }
  };
  return (
    <>
      {!types && (
        <form>
          <label className={classes.label} htmlFor="numOW">Number of Words</label>
          <input
          className={classes.input}
            onChange={(e) => {
              setNumWords(e.target.value);
            }}
            id="numOW"
          />
          <button
          className={classes.button}
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </button>
        </form>
      )}

      {types && <Words types={types}/>}
    </>
  );
};

export default NumberOfWords;
