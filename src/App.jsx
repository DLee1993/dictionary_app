import { useState } from "react";
import { Input } from "@nextui-org/input";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
    const [word, setWord] = useState("");
    const [searchResults, setSearchResults] = useState();
    const [loader, setLoader] = useState(false);

    const wordSearch = async (e) => {
        e.preventDefault();

        try {
            setLoader(true);
            setSearchResults();

            setTimeout(async () => {
                let search = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                let results = await search.json();

                if (results) {
                    setSearchResults(results[0]);
                    setLoader(false);
                }
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="py-10 max-w-[1000px] mx-auto">
            <header className="flex justify-between items-center">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold">wordup</h1>
                <ul className="flex justify-center items-center gap-x-4">
                    <li>dropdown fonts</li>
                    <li>theme toggle</li>
                </ul>
            </header>
            <main className="mt-16">
                <form onSubmit={wordSearch} className="w-full sm:w-1/2">
                    <fieldset>
                        <Input
                            aria-label="input field"
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            label="Search for a word"
                            placeholder="Search for a word"
                            isClearable
                            isRequired
                            onClear={() => setWord("")}
                            classNames={{
                                inputWrapper:
                                    "bg-transparent border-2 border-black py-0 min-h-unit-0 h-fit",
                                innerWrapper: "h-fit flex justify-center items-center",
                                label: "sr-only",
                                input: "h-12",
                                clearButton: "m-0 top-1/2 -translate-y-1/2",
                            }}
                        />
                    </fieldset>
                </form>
                <section className="mt-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold w-72">
                        {searchResults?.word || (loader && <Skeleton />)}
                    </h1>
                </section>
            </main>
        </section>
    );
}

export default App;
