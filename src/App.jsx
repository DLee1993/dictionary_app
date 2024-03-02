import { useState } from "react";
function App() {
    const [word, setWord] = useState("");

    const wordSearch = (e) => {
        e.preventDefault();
        console.log(word);
    };

    return (
        <section className="wrapper">
            <header>
                <h1>wordup</h1>
                <ul>
                    <li>dropdown fonts</li>
                    <li>theme toggle</li>
                </ul>
            </header>
            <main>
                <form onSubmit={wordSearch}>
                    <fieldset>
                        <label htmlFor="searchParams" className="sr-only">
                            search for a word
                        </label>
                        <input
                            type="text"
                            id="searchParams"
                            aria-label="search a word"
                            placeholder="Search for a word"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                        />
                    </fieldset>
                </form>
            </main>
        </section>
    );
}

export default App;
