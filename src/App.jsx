import { useState } from "react";
import { Input } from "@nextui-org/react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Play, Pause, Github } from "./components/Icons";

function App() {
    const [word, setWord] = useState("");
    const [inputError, setInputError] = useState();
    const [searchResults, setSearchResults] = useState();
    const [searchError, setSearchError] = useState();
    const [loader, setLoader] = useState(false);
    const [audioIcon, setAudioIcon] = useState(<Play />);

    const wordSearch = async (e) => {
        e.preventDefault();

        if (word == "") {
            setInputError("Please enter a word");

            setTimeout(() => {
                setInputError("");
            }, 2000);
        } else {
            try {
                setLoader(true);
                setSearchResults();
                setSearchError(false);
                document.getElementById("startMessage").style.display = "none";

                setTimeout(async () => {
                    let search = await fetch(
                        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
                    );
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
        }
    };

    const playAudio = () => {
        var audio = document.getElementById("audio");
        audio.play();
    };

    const IconSwitch = (bool) => {
        if (bool) {
            setAudioIcon(<Pause />);
        } else {
            setAudioIcon(<Play />);
        }
    };

    return (
        <SkeletonTheme>
            <section className="py-10 font-sans">
                <header className="flex justify-between items-center">
                    <a href="/dictionary_app/">
                        <h1 className="text-lg md:text-xl font-bold uppercase text-light bg-accent p-2">
                            wordup
                        </h1>
                    </a>
                    <a href="https://github.com/DLee1993" target="_blank">
                        <p className="sr-only">github profile</p> <Github />
                    </a>
                </header>
                <main className="mt-16 m-auto max-w-3xl">
                    <section>
                        <fieldset className="min-h-20">
                            <form onSubmit={wordSearch}>
                                <fieldset className="flex gap-x-2">
                                    <Input
                                        aria-label="input field"
                                        type="text"
                                        value={word}
                                        onChange={(e) => setWord(e.target.value)}
                                        label="Search for a word"
                                        placeholder="Search for a word"
                                        autoFocus
                                        isClearable
                                        onClear={() => setWord("")}
                                        classNames={{
                                            inputWrapper: `py-0 min-h-unit-0 h-fit dark:bg-light/5 rounded-none p-0 ${
                                                inputError ? "outline-accent" : null
                                            }`,
                                            innerWrapper:
                                                "h-fit flex justify-center items-center rounded-none p-0",
                                            label: "sr-only",
                                            input: "text-base md:text-lg h-10 font-bold rounded-none px-2",
                                            clearButton: "m-0 top-1/2 -translate-y-1/2 text-accent",
                                        }}
                                    />
                                    <button className="bg-accent w-12 h-10 grid place-items-center hover:bg-accent/65 transition-colors">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-1/2 stroke-light"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g
                                                id="SVGRepo_tracerCarrier"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></g>
                                            <g id="SVGRepo_iconCarrier">
                                                {" "}
                                                <path
                                                    d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>{" "}
                                            </g>
                                        </svg>
                                    </button>
                                </fieldset>
                            </form>
                            <p className="text-accent font-bold mt-1">{inputError}</p>
                        </fieldset>
                    </section>
                    <section className="mt-5 md:mt-10">
                        <div
                            className="font-bold max-w-lg mx-auto text-center space-y-8"
                            id="startMessage"
                        >
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-dark/50">
                                Level up your knowledge of the english language.
                            </h1>
                            <p className="text-sm">
                                To get started, type a word in the search bar and press enter.
                            </p>
                        </div>
                        <section>
                            <section className="mt-5 flex flex-col justify-between">
                                <section>
                                    <section className="flex justify-between">
                                        <article className="min-w-72">
                                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold capitalize">
                                                {searchResults?.word ||
                                                    searchError?.title ||
                                                    (loader && <Skeleton />)}
                                            </h1>
                                            <p className="text-accent mt-2 sm:mt-3 md:mt-4">
                                                {searchResults?.phonetic ||
                                                    (loader && !searchError && <Skeleton />)}
                                            </p>
                                        </article>
                                        {searchResults?.audio ? (
                                            <aside className="h-fit">
                                                <button
                                                    id="audioControl"
                                                    className="grid place-items-center size-10 group"
                                                    onClick={playAudio}
                                                    disabled={!searchResults?.audio}
                                                >
                                                    {audioIcon}
                                                </button>
                                                <audio
                                                    src={searchResults?.audio}
                                                    id="audio"
                                                    onPlay={() => IconSwitch(true)}
                                                    onPause={() => IconSwitch(false)}
                                                ></audio>
                                            </aside>
                                        ) : (
                                            loader && !searchError && <Skeleton />
                                        )}
                                    </section>
                                    {searchResults?.source ? (
                                        <p className="flex justify-start items-center flex-wrap gap-x-2 py-5 text-dark/50 dark:text-light/40 font-bold">
                                            Source:
                                            <span className="text-dark dark:text-accent font-normal">
                                                <a
                                                    className="hover:underline"
                                                    href={searchResults?.source}
                                                    target="_blank"
                                                    aria-label={`wiktionary link for ${searchResults?.word}`}
                                                >
                                                    {searchResults?.source}
                                                </a>
                                            </span>
                                        </p>
                                    ) : (
                                        loader && !searchError && <Skeleton />
                                    )}
                                </section>
                            </section>
                            <section>
                                {searchResults
                                    ? searchResults?.meanings.map((meaning, index) => (
                                          <article
                                              key={index}
                                              className={index !== 0 ? "py-10" : null}
                                          >
                                              <h2 className="flex justify-center items-center gap-x-4 italic font-bold text-xl font-serif">
                                                  {meaning.partOfSpeech}{" "}
                                                  <div className="bg-grey/10 w-full h-[2px]"></div>
                                              </h2>
                                              <p className="mt-5 font-bold">Meaning</p>
                                              <ul className="ml-10 mt-10 space-y-2 list-disc">
                                                  {meaning.definitions.map((def, index) => (
                                                      <li
                                                          className="marker:text-accent"
                                                          key={index}
                                                      >
                                                          <div className="flex flex-col gap-y-2">
                                                              {def.definition}
                                                              {def.example && (
                                                                  <span>{`"${def.example}"`}</span>
                                                              )}
                                                          </div>
                                                      </li>
                                                  ))}
                                              </ul>
                                              {meaning.antonyms?.length > 0 && (
                                                  <aside className="font-bold mt-10">
                                                      Antonyms:{" "}
                                                      {meaning.antonyms.map((ant, index) => (
                                                          <span key={index} className="text-accent">
                                                              {(index ? ", " : "") + ant}
                                                          </span>
                                                      ))}
                                                  </aside>
                                              )}
                                              {meaning.synonyms?.length > 0 && (
                                                  <aside className="font-bold mt-10">
                                                      Synonyms:{" "}
                                                      {meaning.synonyms.map((syn, index) => (
                                                          <span key={index} className="text-accent">
                                                              {(index ? ", " : "") + syn}
                                                          </span>
                                                      ))}
                                                  </aside>
                                              )}
                                          </article>
                                      ))
                                    : loader && !searchError && <Skeleton />}
                            </section>
                        </section>
                    </section>
                </main>
            </section>
        </SkeletonTheme>
    );
}

export default App;
