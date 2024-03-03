import { useState } from "react";
import { Input } from "@nextui-org/input";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
    const [word, setWord] = useState("");
    const [searchResults, setSearchResults] = useState();
    const [searchError, setSearchError] = useState();
    const [loader, setLoader] = useState(false);

    const wordSearch = async (e) => {
        e.preventDefault();
        document.getElementById("startMessage").style.display = "none";

        try {
            setLoader(true);
            setSearchResults();

            setTimeout(async () => {
                let search = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                let results = await search.json();

                if (!search.ok) {
                    return setSearchError(results);
                }
                setLoader(false);

                var resultsObject = {
                    word: results[0].word,
                    phonetic: results[0].phonetics.find((o) => o.text).text,
                    meanings: results[0].meanings,
                    audio: results[0].phonetics.find((o) => o.audio)?.audio,
                    source: results[0].sourceUrls[0],
                };

                setSearchResults(resultsObject);
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const playAudio = () => {
        var audio = document.getElementById("audio");
        audio.play();
    };

    return (
        <section className="customScrollbar p-10 max-w-[900px] m-auto bg-light h-screen overflow-y-scroll scroll-smooth">
            <header className="flex justify-between items-center">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold">wordup</h1>
                <ul className="flex justify-center items-center gap-x-4">
                    <li>dropdown fonts</li>
                    <li>theme toggle</li>
                </ul>
            </header>
            <main className="mt-16">
                <form onSubmit={wordSearch}>
                    <fieldset>
                        <Input
                            aria-label="input field"
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            label="Search for a word"
                            placeholder="Search for a word"
                            autoFocus
                            isClearable
                            isRequired
                            onClear={() => setWord("")}
                            classNames={{
                                inputWrapper: "py-0 min-h-unit-0 h-fit",
                                innerWrapper: "h-fit flex justify-center items-center",
                                label: "sr-only",
                                input: "text-base md:text-lg h-12 font-bold",
                                clearButton: "m-0 top-1/2 -translate-y-1/2 text-accent",
                            }}
                        />
                    </fieldset>
                </form>
                <div className="font-bold mt-24 w-2/3 mx-auto" id="startMessage">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent text-center">
                        Simply get started by typing in a word and press enter.
                    </h1>
                </div>
                <section>
                    <section className="mt-10 flex justify-between items-center">
                        <article className="w-72">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold capitalize">
                                {searchResults?.word ||
                                    searchError?.title ||
                                    (loader && <Skeleton />)}
                            </h1>
                            <p className="text-accent">
                                {searchResults?.phonetic || (loader && <Skeleton />)}
                            </p>
                        </article>
                        {searchResults?.audio ? (
                            <aside className="w-20">
                                <button
                                    className="grid place-items-center bg-accentFaded rounded-full w-14 md:w-16 h-14 md:h-16 disabled:bg-grey group"
                                    onClick={playAudio}
                                    disabled={!searchResults?.audio}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-1/2 fill-accent group-disabled:fill-grey"
                                    >
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g
                                            id="SVGRepo_tracerCarrier"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"></path>{" "}
                                        </g>
                                    </svg>
                                </button>
                                <audio src={searchResults?.audio} id="audio"></audio>
                            </aside>
                        ) : (
                            loader && <Skeleton />
                        )}
                    </section>
                    <section>
                        <section>
                            {searchResults?.meanings.map((meaning, index) => (
                                <article key={index}>
                                    <h2>{meaning.partOfSpeech}</h2>
                                    <ul>
                                        <li className="list-none">Meaning</li>
                                        {meaning.definitions.map((def, index) => (
                                            <li
                                                className="list-disc marker:text-accent"
                                                key={index}
                                            >
                                                {def.definition}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </section>
                        {/* <!- Source goes at bottom -> */}
                        {searchResults?.source ? (
                            <p className="flex justify-start items-center gap-x-2">
                                source:
                                <span>
                                    <a
                                        className="hover:underline"
                                        href={searchResults?.source}
                                        target="_blank"
                                    >
                                        {searchResults?.source}
                                    </a>
                                </span>
                            </p>
                        ) : (
                            loader && <Skeleton />
                        )}
                    </section>
                </section>
            </main>
        </section>
    );
}

export default App;
