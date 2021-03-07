import React, { Fragment, useState } from "react";
import { embed, extract } from "zero-width-watermark";
import copy from "copy-to-clipboard";

const useInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);

  return {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    setValue,
    value,
  };
};

const useMode = (initialValue: "EXTRACT" | "EMBED") => {
  const [mode, setMode] = useState<"EXTRACT" | "EMBED">(initialValue);
  return { mode, setMode };
};

const GitHubButton = () => (
  <div>
    <iframe
      src="https://ghbtns.com/github-btn.html?user=redshoga&repo=zero-width-watermark&type=star&count=true&size=large"
      frameBorder="0"
      scrolling="0"
      width="170"
      height="30"
      title="GitHub"
    ></iframe>
  </div>
);

const Page: React.FC = () => {
  const { mode, setMode } = useMode("EMBED");
  const originalText = useInput("");
  const embedText = useInput("");
  const embeddedText = useInput("");
  const [result, setResult] = useState<null | string>(null);

  const changeMode = () => {
    setMode(mode === "EMBED" ? "EXTRACT" : "EMBED");
    originalText.setValue("");
    embedText.setValue("");
    embeddedText.setValue("");
    setResult(null);
  };

  const embedHandler = () => {
    const result = embed(originalText.value, embedText.value);
    setResult(result);
  };

  const extractHandler = () => {
    const result = extract(embeddedText.value) as string;
    setResult(result);
  };

  const copyResultToClipboard = () => {
    if (result) copy(result);
  };

  return (
    <Fragment>
      <style jsx>
        {`
          main {
            width: 600px;
            margin: 0 auto;
          }

          section {
            margin-top: 24px;
          }

          input {
            width: 100%;
          }

          textarea {
            width: 100%;
            height: 300px;
            resize: vertical;
          }

          .margin-top {
            margin-top: 8px;
          }
        `}
      </style>

      <main className="main">
        <h1>zero-width-watermark</h1>

        <GitHubButton />

        <section>
          <div>{mode === "EMBED" ? "EMBED MODE" : "EXTRACT MODE"}</div>
          <button onClick={() => changeMode()}>CHANGE MODE</button>
        </section>

        <section>
          {mode === "EMBED" ? (
            <Fragment>
              <div>
                Original text
                <input
                  type="text"
                  onChange={originalText.onChange}
                  value={originalText.value}
                />
              </div>
              <div>
                Embed text
                <input
                  type="text"
                  onChange={embedText.onChange}
                  value={embedText.value}
                />
              </div>

              <button className="margin-top" onClick={() => embedHandler()}>
                Embed
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <div>
                Text with embedded data
                <input
                  type="text"
                  onChange={embeddedText.onChange}
                  value={embeddedText.value}
                />
              </div>

              <button className="margin-top" onClick={() => extractHandler()}>
                Extract
              </button>
            </Fragment>
          )}

          {result !== null && (
            <Fragment>
              <div className="margin-top">
                {result !== null && (
                  <textarea value={result} readOnly></textarea>
                )}
              </div>

              <button className="margin-top" onClick={copyResultToClipboard}>
                Copy the result to the clipboard
              </button>
            </Fragment>
          )}
        </section>
      </main>
    </Fragment>
  );
};

export default Page;
